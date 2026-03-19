import { articles, getArticleBySlug } from "@/lib/articles";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "記事が見つかりません" };

  const url = absoluteUrl(`/articles/${article.slug}`);

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: article.title,
      description: article.description,
      images: article.coverImage ? [{ url: article.coverImage }] : undefined,
    },
    twitter: {
      card: article.coverImage ? "summary_large_image" : "summary",
      title: article.title,
      description: article.description,
      images: article.coverImage ? [article.coverImage] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) notFound();

  return (
    <article className="mx-auto max-w-3xl rounded-3xl border bg-white p-6 sm:p-10 shadow-sm">
      <div className="mb-6 space-y-4 text-center">
        <h1 className="text-2xl font-extrabold leading-tight sm:text-4xl text-zinc-900">
          {article.title}
        </h1>
        <div className="flex items-center justify-center gap-4 text-sm text-zinc-500">
          <span>{new Date(article.publishedAt).toLocaleDateString("ja-JP")}</span>
          <div className="flex gap-2">
            {article.tags.map((t) => (
              <span key={t} className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                #{t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {article.coverImage && (
        <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-zinc-100">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      <div
        className="prose prose-zinc max-w-none text-zinc-800 leading-relaxed [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:border-l-4 [&>h2]:border-black [&>h2]:pl-3 [&>p]:mb-6 [&>ul]:mb-6 [&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:mb-2"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </article>
  );
}
