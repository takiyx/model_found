import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { absoluteUrl } from "@/lib/site";

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
    };
  }

  const url = absoluteUrl(`/posts/${post.id}`);
  const desc = (post.body || "").replace(/\s+/g, " ").slice(0, 140);
  const image = post.images?.[0]?.url;

  return {
    title: post.title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: desc,
      images: image ? [image] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: post.title,
      description: desc,
      images: image ? [image] : undefined,
    },
  };
}
