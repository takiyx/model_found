import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { absoluteUrl } from "@/lib/site";

function summarize(text: string, max = 160) {
  return (text || "").replace(/\s+/g, " ").trim().slice(0, max);
}

export async function generatePostMetadata(id: string): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      body: true,
      createdAt: true,
      updatedAt: true,
      isPublic: true,
      images: { take: 1, orderBy: { createdAt: "asc" }, select: { url: true } },
      author: { select: { displayName: true } },
    },
  });

  if (!post) {
    return {
      title: "投稿が見つかりません",
      alternates: { canonical: "/" },
      robots: { index: false, follow: false },
    };
  }

  const url = absoluteUrl(`/posts/${post.id}`);
  const desc = summarize(post.body, 160);
  const image = post.images?.[0]?.url;

  // Safety: never index hidden posts.
  const robots = post.isPublic
    ? ({ index: true, follow: true } as const)
    : ({ index: false, follow: true } as const);

  return {
    title: post.title,
    description: desc,
    alternates: { canonical: url },
    robots,
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: desc,
      publishedTime: post.createdAt.toISOString?.() ?? (post.createdAt as any),
      modifiedTime: post.updatedAt.toISOString?.() ?? (post.updatedAt as any),
      authors: post.author?.displayName ? [post.author.displayName] : undefined,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: post.title,
      description: desc,
      images: image ? [image] : undefined,
    },
  };
}
