import Link from "next/link";
import { prisma } from "@/lib/db";
import { PostMode, Region } from "@prisma/client";
import { PostCard } from "@/components/post-card";
import { UserCard } from "@/components/user-card";
import { DiscoverControls } from "@/components/discover-controls";
import { SectionHeader } from "@/components/section-header";
import { searchPostIds } from "@/lib/fts";
import { getSession } from "@/lib/session";
import { FEATURED_TAGS } from "@/lib/curation";
import { normalizeTag, parseTags } from "@/lib/upload";
import { getRelatedTagsForTag } from "@/lib/related-tags";
import { getWeeklyPicks } from "@/lib/picks";

function modeLabel(mode: string | undefined) {
  if (mode === "photographer") return "撮影者募集";
  if (mode === "model") return "モデル募集";
  return "All";
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; region?: string; q?: string; tag?: string; prefecture?: string; hasImage?: string; days?: string; hasReward?: string; sort?: string }>;
}) {
  const sp = await searchParams;
  const mode = sp.mode;
  const region = sp.region;
  const q = sp.q?.trim();
  const tag = sp.tag ? normalizeTag(sp.tag) : undefined;
  const prefecture = sp.prefecture;
  const hasImage = sp.hasImage === "1";
  const hasReward = sp.hasReward; // "1" | "0" | undefined
  const sort = sp.sort; // "latest" | "image" | undefined
  const days = sp.days ? Number(sp.days) : null;

  const where: any = { isPublic: true };
  if (mode === "photographer") where.mode = PostMode.PHOTOGRAPHER;
  if (mode === "model") where.mode = PostMode.MODEL;
  if (region === "east") where.region = Region.EAST;
  if (region === "west") where.region = Region.WEST;

  if (prefecture) {
    // Prefecture is an enum; Prisma will validate at runtime.
    where.prefecture = prefecture;
  }

  if (hasImage) {
    where.images = { some: {} };
  }

  if (days && Number.isFinite(days) && days > 0) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    where.createdAt = { gte: since };
  }

  if (hasReward === "1") {
    where.reward = { not: "" };
  }
  if (hasReward === "0") {
    where.reward = "";
  }

  // Tag filter (exact match by parsing). We prefilter with contains for DB efficiency.
  if (tag) {
    where.tags = { contains: tag };
  }

  const select = {
    id: true,
    title: true,
    mode: true,
    prefecture: true,
    createdAt: true,
    reward: true,
    place: true,
    dateText: true,
    tags: true,
    author: { select: { displayName: true } },
    images: { orderBy: { createdAt: "asc" }, take: 1, select: { url: true, alt: true, id: true } },
  } as const;

  // Search: use SQLite FTS5 when q exists (smarter than contains)
  // Sorting:
  // - If q exists: order by FTS rank (we preserve rank order in JS)
  // - Else: latest or image-first
  let posts = [] as any[];
  if (q) {
    const ids = await searchPostIds(q, 60);
    if (ids.length === 0) {
      posts = [];
    } else {
      const rows = await prisma.post.findMany({
        where: { ...where, id: { in: ids } },
        select,
      });
      const idx = new Map(ids.map((id, i) => [id, i]));
      posts = rows.sort((a, b) => (idx.get(a.id) ?? 1e9) - (idx.get(b.id) ?? 1e9));
    }
  } else {
    const orderBy =
      sort === "image"
        ? [{ images: { _count: "desc" as const } }, { createdAt: "desc" as const }]
        : [{ createdAt: "desc" as const }];

    posts = await prisma.post.findMany({
      where,
      orderBy,
      take: 60,
      select,
    });
  }

  // Exact tag match
  if (tag) {
    posts = posts.filter((p) => parseTags(p.tags).includes(tag));
  }

  // Bento hero card: prefer a post with image for the first (featured) slot.
  // Keep overall ordering, just swap the first "has image" post to the front.
  const heroIndex = posts.findIndex((p) => (p.images?.length ?? 0) > 0);
  if (heroIndex > 0) {
    const hero = posts[heroIndex];
    posts = [hero, ...posts.slice(0, heroIndex), ...posts.slice(heroIndex + 1)];
  }

  // Related tags (stable + context-aware)
  const relatedTags = tag
    ? await getRelatedTagsForTag({ tag, mode, region, prefecture })
    : [];

  // Picks (curation module): show top tags as quick entrances and weekly picks.
  const PRIMARY_TAGS = ["nude", "ポートレート", "studio"].map(normalizeTag);
  const pickTags = PRIMARY_TAGS.filter(Boolean);

  const picks = await Promise.all(
    pickTags.map(async (t) => {
      const posts = await getWeeklyPicks({ tag: t, select, take: 3 });
      return { tag: t, posts };
    })
  );

  const creators = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 12,
    select: {
      id: true,
      displayName: true,
      avatarUrl: true,
      prefecture: true,
      basePlace: true,
      interests: true,
      isPhotographer: true,
      isModel: true,
    },
  });

  const session = await getSession();
  const currentUserId = session?.user?.id;

  const favoredPostIds = new Set<string>();
  const favoredUserIds = new Set<string>();

  if (currentUserId) {
    const postIds = [
      ...new Set([
        ...posts.map((p) => p.id),
        ...picks.flatMap((g) => g.posts.map((p) => p.id)),
      ]),
    ];
    const userIds = creators.map((u) => u.id);

    if (postIds.length) {
      const favPosts = await prisma.favoritePost.findMany({
        where: { userId: currentUserId, postId: { in: postIds } },
        select: { postId: true },
      });
      favPosts.forEach((f) => favoredPostIds.add(f.postId));
    }

    if (userIds.length) {
      const favUsers = await prisma.favoriteUser.findMany({
        where: { userId: currentUserId, targetUserId: { in: userIds } },
        select: { targetUserId: true },
      });
      favUsers.forEach((f) => favoredUserIds.add(f.targetUserId));
    }
  }


  const chipBase =
    "whitespace-nowrap rounded-2xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-black/80 transition hover:border-zinc-300 hover:bg-zinc-50";
  const chipActive =
    "whitespace-nowrap rounded-2xl border border-zinc-200 bg-[color:var(--accent)] px-3 py-1.5 text-xs font-semibold text-black shadow-sm";

  const activeMode = modeLabel(mode);

  return (
    <div className="grid gap-12">
      <header className="grid gap-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold tracking-[0.18em] text-zinc-500">DISCOVER</div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-black sm:text-4xl">
              モデルひろば
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-700">
              モデルと撮影者の募集を、画像中心で見つけよう。今は <span className="font-semibold text-black">{activeMode}</span> を表示中。
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/posts/new"
              className="inline-flex rounded-2xl bg-[color:var(--accent-strong)] px-4 py-2 text-sm font-semibold text-black shadow-sm transition hover:brightness-105"
            >
              投稿する
            </Link>
          </div>
        </div>

        {/* Mode chips (main axis) */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Link href="/" className={!mode ? chipActive : chipBase}>
            All
          </Link>
          <Link
            href="/?mode=photographer"
            className={mode === "photographer" ? chipActive : chipBase}
          >
            撮影者募集
          </Link>
          <Link href="/?mode=model" className={mode === "model" ? chipActive : chipBase}>
            モデル募集
          </Link>
        </div>

        {/* Region chips (secondary) */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Link
            href={mode ? `/?mode=${mode}` : "/"}
            className={!region ? chipActive : chipBase}
          >
            全国
          </Link>
          <Link
            href={mode ? `/?mode=${mode}&region=east` : "/?region=east"}
            className={region === "east" ? chipActive : chipBase}
          >
            東日本
          </Link>
          <Link
            href={mode ? `/?mode=${mode}&region=west` : "/?region=west"}
            className={region === "west" ? chipActive : chipBase}
          >
            西日本
          </Link>
        </div>
      </header>

      {/* Controls panel */}
      <div className="rounded-2xl border border-zinc-200 bg-zinc-200/80 px-6 py-5 shadow-sm">
        <DiscoverControls />
      </div>

      {/* Posts */}
      <section className="grid gap-4">
        <SectionHeader title="投稿" subtitle="最新の募集" />

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-100 p-10 text-sm text-zinc-700">
            まだ投稿がありません。
          </div>
        ) : (
          <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <div
                key={p.id}
                className={
                  i === 0
                    ? "sm:col-span-2 sm:row-span-2"
                    : ""
                }
              >
                <PostCard post={p as any} favorited={favoredPostIds.has(p.id)} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Users */}
      <section className="grid gap-4">
        <SectionHeader title="ユーザー" subtitle="新規登録順" />

        <div className="flex gap-4 overflow-x-auto pb-2">
          {creators.map((u) => (
            <UserCard key={u.id} user={u as any} favorited={favoredUserIds.has(u.id)} />
          ))}
        </div>
      </section>

      {/* Weekly picks */}
      <section className="rounded-2xl border border-zinc-200 bg-zinc-100 p-6">
        <SectionHeader title="今週のピックアップ" subtitle="直近7日から、まず見てほしい投稿" />

        <div className="mt-4 grid gap-6 md:grid-cols-3">
          {picks.map((g) => (
            <div key={g.tag} className="grid gap-3">
              <div className="flex items-center justify-between">
                <Link
                  href={`/?tag=${encodeURIComponent(g.tag)}`}
                  className="text-sm font-semibold text-zinc-900 hover:underline"
                >
                  {g.tag}
                </Link>
                <Link className="text-xs text-zinc-600 hover:text-zinc-900" href={`/t/${encodeURIComponent(g.tag)}`}>
                  タグへ
                </Link>
              </div>

              {g.posts.length === 0 ? (
                <div className="rounded-2xl border bg-zinc-50 p-4 text-sm text-zinc-600">まだ投稿がありません。</div>
              ) : (
                <div className="grid gap-4">
                  {(g.posts as any[]).map((p: any) => (
                    <PostCard key={p.id} post={p as any} favorited={favoredPostIds.has(p.id)} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Recommended tags */}
      <section className="rounded-2xl border border-zinc-200 bg-zinc-100 p-6">
        <SectionHeader title="おすすめタグ" actionLabel="もっと見る" actionHref="/tags" />

        {tag ? (
          <div className="mt-3 grid gap-3">
            <div>
              <div className="text-xs font-medium text-zinc-500">絞り込み中</div>
              <div className="mt-2 flex flex-wrap gap-2">
                <Link
                  href={`/?tag=${encodeURIComponent(tag)}`}
                  className="rounded-2xl border bg-zinc-900 px-3 py-1.5 text-sm text-white hover:bg-zinc-800"
                >
                  {tag}
                </Link>
                <Link
                  href="/"
                  className="rounded-2xl border bg-white px-3 py-1.5 text-sm hover:bg-zinc-50"
                >
                  解除
                </Link>
              </div>
            </div>

            {relatedTags.length ? (
              <div>
                <div className="text-xs font-medium text-zinc-500">関連タグ</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {relatedTags.map((t) => (
                    <Link
                      key={t}
                      href={`/?tag=${encodeURIComponent(t)}`}
                      className="rounded-2xl border bg-white px-3 py-1.5 text-sm hover:bg-zinc-50"
                    >
                      {t}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            <div>
              <div className="text-xs font-medium text-zinc-500">おすすめ</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {FEATURED_TAGS.filter((t) => t !== tag)
                  .slice(0, 10)
                  .map((t) => (
                    <Link
                      key={t}
                      href={`/t/${encodeURIComponent(t)}`}
                      className="rounded-2xl border bg-white px-3 py-1.5 text-sm hover:bg-zinc-50"
                    >
                      {t}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {FEATURED_TAGS.map((t) => (
              <Link
                key={t}
                href={`/t/${encodeURIComponent(t)}`}
                className="rounded-2xl border bg-white px-3 py-1.5 text-sm hover:bg-zinc-50"
              >
                {t}
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border bg-white p-6">
        <h2 className="text-lg font-semibold">安全にご利用ください</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-600">
          <li>高額報酬・自撮りのみなど不自然な条件は慎重に。</li>
          <li>個人情報の交換は、信頼できる相手と必要最小限で。</li>
          <li>不審な投稿は運営へ報告できる導線を後で追加します。</li>
        </ul>
      </section>
    </div>
  );
}
