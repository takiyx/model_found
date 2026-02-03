import Link from "next/link";
import { prisma } from "@/lib/db";
import { parseTags } from "@/lib/upload";
import { FEATURED_TAGS } from "@/lib/curation";
import { getRelatedTagsForTag } from "@/lib/related-tags";

export default async function TagsPage() {
  const posts = await prisma.post.findMany({
    where: { isPublic: true },
    take: 300,
    select: { tags: true },
    orderBy: { createdAt: "desc" },
  });

  const counts = new Map<string, number>();
  for (const p of posts) {
    for (const t of parseTags(p.tags)) {
      counts.set(t, (counts.get(t) ?? 0) + 1);
    }
  }

  const popular = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 40);

  // Precompute related tags for featured (small set, ok to query)
  const featuredRelated = await Promise.all(
    FEATURED_TAGS.map(async (t) => ({
      tag: t,
      related: await getRelatedTagsForTag({ tag: t }),
    }))
  );

  return (
    <div className="grid gap-6">
      <header className="rounded-3xl border bg-white p-6">
        <h1 className="text-2xl font-semibold">タグ</h1>
        <p className="mt-2 text-sm text-zinc-600">人気のタグから投稿を探せます。</p>
      </header>

      <section className="rounded-3xl border bg-white p-6">
        <h2 className="text-lg font-semibold">おすすめ</h2>
        <div className="mt-3 grid gap-4">
          {featuredRelated.map(({ tag, related }) => (
            <div key={tag} className="grid gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/t/${encodeURIComponent(tag)}`} className="rounded-full border bg-zinc-900 px-3 py-1.5 text-sm text-white hover:bg-zinc-800">
                  {tag}
                </Link>
                <span className="text-xs text-zinc-500">周辺タグ</span>
              </div>
              {related.length ? (
                <div className="flex flex-wrap gap-2">
                  {related.slice(0, 8).map((t) => (
                    <Link key={t} href={`/t/${encodeURIComponent(t)}`} className="rounded-full border bg-white px-3 py-1.5 text-sm hover:bg-zinc-50">
                      {t}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-zinc-500">（まだデータが少ないです）</div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-6">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-semibold">人気</h2>
          <div className="text-xs text-zinc-500">直近の投稿から集計</div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {popular.map(([t, c]) => (
            <Link key={t} href={`/t/${encodeURIComponent(t)}`} className="rounded-full border bg-white px-3 py-1.5 text-sm hover:bg-zinc-50">
              {t}
              <span className="ml-2 text-xs text-zinc-500">{c}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
