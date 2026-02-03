export type Topic = {
  id: string;
  group: string;
  title: string;
  subtitle?: string;
  // primary tag for counting + discovery filter
  tag?: string;
  // either tag-based or discover url
  href: string;
  tags: string[];
};

const DEFAULT_TOPICS: Topic[] = [
  {
    id: "weekly-portrait",
    group: "今週のテーマ",
    title: "ポートレート",
    subtitle: "定番 / 初心者歓迎",
    tag: "ポートレート",
    href: "/?tag=ポートレート",
    tags: ["ポートレート", "初心者歓迎"],
  },
  {
    id: "weekly-street",
    group: "今週のテーマ",
    title: "ストリート",
    subtitle: "自然光 / ロケ",
    tag: "ストリート",
    href: "/?tag=ストリート",
    tags: ["ストリート", "ロケ"],
  },
  {
    id: "ops-fashion",
    group: "作品撮り",
    title: "ファッション",
    subtitle: "スタジオ / 衣装",
    tag: "ファッション",
    href: "/?tag=ファッション",
    tags: ["ファッション", "スタジオ"],
  },
  {
    id: "ops-cosplay",
    group: "作品撮り",
    title: "コスプレ",
    subtitle: "イベント / 併せ",
    tag: "コスプレ",
    href: "/?tag=コスプレ",
    tags: ["コスプレ"],
  },
] as const;

function parseTopicsEnv(): Topic[] | null {
  const raw = process.env.DISCOVER_TOPICS;
  if (!raw) return null;
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return null;
    const topics: Topic[] = arr
      .map((x: any, i: number) => {
        const title = String(x?.title ?? "").trim();
        if (!title) return null;
        const id = String(x?.id ?? title.toLowerCase().replace(/\s+/g, "-") ?? i).trim();
        const group = String(x?.group ?? "Topics").trim() || "Topics";
        const tag = x?.tag ? String(x.tag).trim() : undefined;
        const href = String(x?.href ?? (tag ? `/?tag=${encodeURIComponent(tag)}` : "/")).trim();
        const subtitle = x?.subtitle ? String(x.subtitle) : undefined;
        const tags = Array.isArray(x?.tags)
          ? x.tags.map((t: any) => String(t).trim()).filter(Boolean)
          : tag
            ? [tag]
            : [];
        return { id, group, title, subtitle, tag, href, tags } as Topic;
      })
      .filter(Boolean) as Topic[];

    return topics.length ? topics : null;
  } catch {
    return null;
  }
}

export const DISCOVER_TOPICS: readonly Topic[] = parseTopicsEnv() ?? DEFAULT_TOPICS;
