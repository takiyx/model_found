const DEFAULT_FEATURED_TAGS = [
  "ポートレート",
  "ストリート",
  "ファッション",
  "スタジオ",
  "コスプレ",
  "ロケ",
  "初心者歓迎",
] as const;

function parseFeaturedTagsEnv() {
  const raw = process.env.FEATURED_TAGS;
  if (!raw) return null;

  // 1) JSON array
  if (raw.trim().startsWith("[")) {
    try {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        return arr.map((x) => String(x).trim()).filter(Boolean);
      }
    } catch {
      // fallthrough
    }
  }

  // 2) Comma-separated
  const list = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return list.length ? list : null;
}

// Ops-friendly: configure via env FEATURED_TAGS
export const FEATURED_TAGS: readonly string[] = parseFeaturedTagsEnv() ?? DEFAULT_FEATURED_TAGS;
