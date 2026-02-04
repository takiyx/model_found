import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function siteUrl() {
  // Prefer explicit site URL (set this in Vercel env): https://example.com
  const env = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (env) return env.replace(/\/$/, "");
  // Fallbacks (Vercel)
  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

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
