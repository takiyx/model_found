function safeJson(data: unknown) {
  return JSON.stringify(data, null, 0);
}

export function JsonLd({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: safeJson(data) }}
    />
  );
}

function siteUrl() {
  const env = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (env) return env.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export function baseStructuredData() {
  const base = siteUrl();
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Model Find",
      url: base,
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Model Find",
      url: base,
    },
  ];
}

export function faqStructuredData({
  url,
  items,
}: {
  url: string;
  items: Array<{ q: string; a: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
    url,
  };
}

export function absoluteUrl(path: string) {
  const base = siteUrl();
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
