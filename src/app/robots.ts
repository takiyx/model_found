import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Avoid indexing auth/ops pages
        disallow: [
          "/admin/",
          "/api/",
          "/login",
          "/logout",
          "/signup",
          "/settings/",
          "/inbox/",
          "/notifications/",
          "/favorites",
          "/threads/",
          "/posts/new",
          "/posts/*/edit",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
