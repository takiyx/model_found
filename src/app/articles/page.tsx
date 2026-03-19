import { articles } from "@/lib/articles";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "コラム・お役立ち記事",
  description: "ポートレート撮影や被写体に関するお役立ち情報、ノウハウ、マナーを一挙大公開！",
};

export default function ArticlesIndex() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-8 text-2xl font-extrabold tracking-tight sm:text-3xl">
        コラム・お役立ち記事
      </h1>
      <div className="grid gap-6 sm:grid-cols-2">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/articles/${article.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border bg-white transition hover:shadow-md"
          >
            {article.coverImage && (
              <div className="relative aspect-[16/9] w-full bg-zinc-100">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  unoptimized
                />
              </div>
            )}
            <div className="flex flex-1 flex-col p-5">
              <div className="mb-2 text-xs text-zinc-500">
                {new Date(article.publishedAt).toLocaleDateString("ja-JP")}
              </div>
              <h2 className="mb-2 text-lg font-bold leading-snug group-hover:underline">
                {article.title}
              </h2>
              <p className="line-clamp-2 text-sm text-zinc-600">
                {article.description}
              </p>
              <div className="mt-auto pt-4 flex gap-2 flex-wrap">
                {article.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
