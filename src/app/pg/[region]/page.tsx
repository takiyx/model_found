import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { parseRegion, regionLabel } from "@/lib/regions";
import { PostCard } from "@/components/post-card";
import { getSession } from "@/lib/session";

export default async function RegionPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region: regionParam } = await params;
  const region = parseRegion(regionParam);
  if (!region) return notFound();

  const posts = await prisma.post.findMany({
    where: { region, isPublic: true },
    orderBy: { createdAt: "desc" },
    take: 60,
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
  const favoredPostIds = new Set<string>();
  if (currentUserId && posts.length) {
    const fav = await prisma.favoritePost.findMany({
      where: { userId: currentUserId, postId: { in: posts.map((p) => p.id) } },
      select: { postId: true },
    });
    fav.forEach((x) => favoredPostIds.add(x.postId));
  }

  const label = regionLabel(region);

  return (
    <div className="grid gap-10">
      <header className="grid gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-medium text-zinc-500">Discover</div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              {label}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600">
              撮影者・モデルの募集を見つけよう。最新 {posts.length} 件（最大60件）。
            </p>
          </div>

          <Link
            href="/posts/new"
            className="inline-flex rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-800"
          >
            投稿する
          </Link>
        </div>

        {/* Category chips (Cosmos-like) */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <span className="whitespace-nowrap rounded-full border bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white">
            Featured
          </span>
          <span className="whitespace-nowrap rounded-full border bg-white px-3 py-1.5 text-xs text-zinc-600">
            Portrait
          </span>
          <span className="whitespace-nowrap rounded-full border bg-white px-3 py-1.5 text-xs text-zinc-600">
            Fashion
          </span>
          <span className="whitespace-nowrap rounded-full border bg-white px-3 py-1.5 text-xs text-zinc-600">
            Studio
          </span>
          <span className="whitespace-nowrap rounded-full border bg-white px-3 py-1.5 text-xs text-zinc-600">
            Cosplay
          </span>
        </div>
      </header>

      {posts.length === 0 ? (
        <div className="rounded-3xl border bg-white p-10 text-sm text-zinc-600">
          まだ投稿がありません。
        </div>
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
