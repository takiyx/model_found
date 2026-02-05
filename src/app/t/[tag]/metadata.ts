import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export function generateTagMetadata(tag: string, count?: number): Metadata {
  const title = `#${tag} の募集`;
  const desc = count != null ? `「${tag}」の投稿一覧（${count}件）。モデル/撮影者の募集を探せます。` : `「${tag}」の投稿一覧。モデル/撮影者の募集を探せます。`;
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
    },
    twitter: {
      card: "summary",
      title,
      description: desc,
    },
  };
}
