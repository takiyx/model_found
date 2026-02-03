import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { prefectureLabels } from "@/lib/prefectures";
import { PostCard } from "@/components/post-card";
import { getSession } from "@/lib/session";
import { BlockButton } from "@/components/block-button";
import { ImageGallery } from "@/components/image-gallery";

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      displayName: true,
      bio: true,
      prefecture: true,
      basePlace: true,
      interests: true,
      isPhotographer: true,
      isModel: true,
      avatarUrl: true,
      websiteUrl: true,
      instagramHandle: true,
      xHandle: true,
      portfolioText: true,
      portfolioImages: true,
      shootOkText: true,
      shootNgText: true,
      createdAt: true,
    },
  });

  if (!user) return notFound();

  const posts = await prisma.post.findMany({
    where: { authorId: id, isPublic: true },
    orderBy: { createdAt: "desc" },
    take: 30,
    select: {
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
    },
  });

  const session = await getSession();
  const currentUserId = session?.user?.id;
  const isMe = currentUserId === user.id;

  const initialBlocked = currentUserId
    ? !!(await prisma.blockUser.findUnique({
        where: { blockerId_blockedId: { blockerId: currentUserId, blockedId: user.id } },
        select: { blockerId: true },
      }))
    : false;

  const favoredPostIds = new Set<string>();
  if (currentUserId && posts.length) {
    const fav = await prisma.favoritePost.findMany({
      where: { userId: currentUserId, postId: { in: posts.map((p) => p.id) } },
      select: { postId: true },
    });
    fav.forEach((x) => favoredPostIds.add(x.postId));
  }

  const portfolioImages: { id: string; url: string; alt: string }[] = (() => {
    try {
      const urls = user.portfolioImages ? (JSON.parse(user.portfolioImages) as string[]) : [];
      return urls.slice(0, 9).map((url, i) => ({ id: `p-${i}`, url, alt: "" }));
    } catch {
      return [];
    }
  })();

  return (
    <div className="grid gap-10">
      <header className="rounded-3xl border bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-20 w-20 overflow-hidden rounded-3xl border bg-zinc-100">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div>
              <div className="text-xs font-medium text-zinc-500">Creator</div>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight">{user.displayName}</h1>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-600">
                {user.isPhotographer ? (
                  <span className="rounded-full border bg-zinc-50 px-2 py-0.5">撮影者</span>
                ) : null}
                {user.isModel ? (
                  <span className="rounded-full border bg-zinc-50 px-2 py-0.5">モデル</span>
                ) : null}
                {user.prefecture ? (
                  <span className="rounded-full border bg-zinc-50 px-2 py-0.5">
                    {prefectureLabels[user.prefecture]}
                  </span>
                ) : null}
                {user.basePlace ? (
                  <span className="rounded-full border bg-zinc-50 px-2 py-0.5">{user.basePlace}</span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isMe ? (
              <Link
                href="/settings/profile"
                className="rounded-full border px-3 py-1.5 text-sm hover:bg-zinc-50"
              >
                プロフィール編集
              </Link>
            ) : null}

            {currentUserId && !isMe ? (
              <BlockButton blockedId={user.id} initialBlocked={initialBlocked} />
            ) : null}
          </div>
        </div>

        {user.bio ? (
          <div className="mt-6 text-sm text-zinc-700 whitespace-pre-wrap">{user.bio}</div>
        ) : (
          <div className="mt-6 text-sm text-zinc-500">プロフィールはまだ設定されていません。</div>
        )}

        {user.interests ? (
          <div className="mt-4 text-sm text-zinc-600">
            <span className="font-medium text-zinc-900">興味：</span>
            {user.interests}
          </div>
        ) : null}

        {(user.websiteUrl || user.instagramHandle || user.xHandle) ? (
          <div className="mt-6 grid gap-2 text-sm">
            <div className="font-medium text-zinc-900">リンク</div>
            <div className="flex flex-wrap gap-2">
              {user.websiteUrl ? (
                <a className="rounded-full border bg-white px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50" href={user.websiteUrl} target="_blank" rel="noreferrer">
                  Website
                </a>
              ) : null}
              {user.instagramHandle ? (
                <a className="rounded-full border bg-white px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50" href={`https://www.instagram.com/${user.instagramHandle}`} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              ) : null}
              {user.xHandle ? (
                <a className="rounded-full border bg-white px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50" href={`https://x.com/${user.xHandle}`} target="_blank" rel="noreferrer">
                  X
                </a>
              ) : null}
            </div>
          </div>
        ) : null}
      </header>

      {(user.shootOkText || user.shootNgText) ? (
        <section className="rounded-3xl border bg-white p-6">
          <div className="flex items-end justify-between">
            <h2 className="text-lg font-semibold">撮影条件 / NG</h2>
            <div className="text-xs text-zinc-500">事前共有</div>
          </div>

          {user.shootOkText ? (
            <div className="mt-4">
              <div className="text-xs font-medium text-zinc-500">OK（可能な範囲）</div>
              <div className="mt-2 whitespace-pre-wrap text-sm text-zinc-700">{user.shootOkText}</div>
            </div>
          ) : null}

          {user.shootNgText ? (
            <div className="mt-4">
              <div className="text-xs font-medium text-zinc-500">NG（不可・注意点）</div>
              <div className="mt-2 whitespace-pre-wrap text-sm text-zinc-700">{user.shootNgText}</div>
            </div>
          ) : null}
        </section>
      ) : null}

      {(user.portfolioText || portfolioImages.length > 0) ? (
        <section className="rounded-3xl border bg-white p-6">
          <div className="flex items-end justify-between">
            <h2 className="text-lg font-semibold">ポートフォリオ</h2>
            <div className="text-xs text-zinc-500">最大9枚</div>
          </div>

          {user.portfolioText ? (
            <div className="mt-4 whitespace-pre-wrap text-sm text-zinc-700">{user.portfolioText}</div>
          ) : null}

          {portfolioImages.length > 0 ? (
            <div className="mt-6">
              <ImageGallery images={portfolioImages} />
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="grid gap-4">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-semibold">投稿</h2>
          <div className="text-xs text-zinc-500">最新 {posts.length} 件</div>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-3xl border bg-white p-10 text-sm text-zinc-600">まだ投稿がありません。</div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <PostCard key={p.id} post={p as any} favorited={favoredPostIds.has(p.id)} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
