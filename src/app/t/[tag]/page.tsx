import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PostCard } from "@/components/post-card";
import { normalizeTag, parseTags } from "@/lib/upload";
import { getSession } from "@/lib/session";
import { FEATURED_TAGS } from "@/lib/curation";
import { getRelatedTagsForTag } from "@/lib/related-tags";
import { generateTagMetadata } from "./metadata";

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const decoded = normalizeTag(decodeURIComponent(tag));
  if (!decoded) return { title: "タグ" };
  return generateTagMetadata(decoded);
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decoded = normalizeTag(decodeURIComponent(tag));
  if (!decoded) return notFound();

  // Cheap prefilter then exact match by parsing
  const rough = await prisma.post.findMany({
    where: { isPublic: true, tags: { contains: decoded } },
    orderBy: { createdAt: "desc" },
    take: 80,
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

  const posts = rough.filter((p) => parseTags(p.tags).includes(decoded));

  const session = await getSession();
  const currentUserId = session?.user?.id;
  const favoredPostIds = new Set<string>();
  if (currentUserId && posts.length) {
    const fav = await prisma.favoritePost.findMany({
      where: { userId: currentUserId, postId: { in: posts.map((p) => p.id) } },
      select: { postId: true },
    });
    fav.forEach((x) => favoredPostIds.add(x.postId));
  }

  const relatedTags = await getRelatedTagsForTag({ tag: decoded });

  return (
    <div className="grid gap-6">
      <header className="rounded-3xl border bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-medium text-zinc-500">Tag</div>
            <h1 className="mt-2 text-2xl font-semibold">#{decoded}</h1>
            <p className="mt-2 text-sm text-zinc-600">{posts.length} 件</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link className="rounded-full border px-3 py-1.5 text-sm hover:bg-zinc-50" href="/tags">
              タグ一覧
            </Link>
            <Link
              className="rounded-full border px-3 py-1.5 text-sm hover:bg-zinc-50"
              href={`/?tag=${encodeURIComponent(decoded)}`}
            >
              Discoverで探す
            </Link>
          </div>
        </div>

        {relatedTags.length ? (
          <div className="mt-5">
            <div className="text-xs font-medium text-zinc-500">関連タグ</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {relatedTags.slice(0, 12).map((t) => (
                <Link
                  key={t}
                  href={`/t/${encodeURIComponent(t)}`}
                  className="rounded-full border bg-white px-3 py-1.5 text-sm hover:bg-zinc-50"
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-5">
          <div className="text-xs font-medium text-zinc-500">おすすめ</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {FEATURED_TAGS.filter((t) => t !== decoded)
              .slice(0, 10)
              .map((t) => (
                <Link
                  key={t}
                  href={`/t/${encodeURIComponent(t)}`}
                  className="rounded-full border bg-white px-3 py-1.5 text-sm hover:bg-zinc-50"
                >
                  {t}
                </Link>
              ))}
          </div>
        </div>
      </header>

      {posts.length === 0 ? (
        <div className="rounded-3xl border bg-white p-10 text-sm text-zinc-600">まだ投稿がありません。</div>
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.id} post={p as any} favorited={favoredPostIds.has(p.id)} />
          ))}
        </section>
      )}
    </div>
  );
}
