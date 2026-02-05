import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/rules`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/tags`, lastModified: now, changeFrequency: "daily", priority: 0.7 },

    // Landing pages for search intents
    { url: `${base}/lp/portrait-model`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/lp/model-keijiban`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/lp/satsuei-boshu`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/lp/nude-model-boshu`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/lp/nude-model-keijiban`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
  ];

  // Public posts (cap to keep sitemap bounded)
  const posts = await prisma.post.findMany({
    where: { isPublic: true },
    orderBy: { updatedAt: "desc" },
    take: 500,
    select: { id: true, updatedAt: true },
  });

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/posts/${p.id}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...postRoutes];
}
