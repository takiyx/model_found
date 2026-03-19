import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export function generateTagMetadata(tag: string, count?: number): Metadata {
  const title = `${tag}のポートレートモデル・カメラマン募集 | Model Find`;
  const desc =
    count != null
      ? `「${tag}」に関するモデル・カメラマンの募集一覧（${count}件）。相互无償や有償などの条件で最新の投稿から探せます。`
      : `「${tag}」に関するモデル・カメラマンの募集一覧。最新の投稿から条件に合う相手を見つけましょう。`;
  const url = absoluteUrl(`/t/${encodeURIComponent(tag)}`);

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description: desc,
      // If no per-tag image is set, Next.js will fall back to file-based metadata
      // (src/app/opengraph-image.tsx).
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      // Falls back to src/app/twitter-image.tsx
    },
  };
}
