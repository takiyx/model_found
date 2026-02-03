import { prisma } from "@/lib/db";
import { PostMode, Prefecture, Region } from "@prisma/client";
import { parseTags } from "@/lib/upload";

function envInt(key: string, fallback: number) {
  const raw = process.env[key];
  if (!raw) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

// Ops-friendly knobs (optional)
export const RELATED_TAGS_SAMPLE_TAKE = envInt("RELATED_TAGS_SAMPLE_TAKE", 300);
export const RELATED_TAGS_MIN_SAMPLE = envInt("RELATED_TAGS_MIN_SAMPLE", 40);
export const RELATED_TAGS_MAX = envInt("RELATED_TAGS_MAX", 10);

export async function getRelatedTagsForTag({
  tag,
  mode,
  region,
  prefecture,
}: {
  tag: string;
  mode?: string;
  region?: string;
  prefecture?: string;
}) {
  const t = tag.trim();
  if (!t) return [] as string[];

  // Context-aware sampling: try narrower (mode/prefecture/region) first, then broaden.
  const base: any = { isPublic: true, tags: { contains: t } };

  // Keep only stable context signals (avoid hasImage/days/hasReward/sort/q)
  if (mode === "photographer") base.mode = PostMode.PHOTOGRAPHER;
  if (mode === "model") base.mode = PostMode.MODEL;
  if (region === "east") base.region = Region.EAST;
  if (region === "west") base.region = Region.WEST;
  if (prefecture) base.prefecture = prefecture as Prefecture;

  const candidates: any[] = [
    base,
    // broaden: drop prefecture
    (() => {
      const w = { ...base };
      delete w.prefecture;
      return w;
    })(),
    // broaden: drop region
    (() => {
      const w = { ...base };
      delete w.prefecture;
      delete w.region;
      return w;
    })(),
    // broadest
    { isPublic: true, tags: { contains: t } },
  ];

  let sample: { tags: string }[] = [];
  for (const w of candidates) {
    sample = await prisma.post.findMany({
      where: w,
      orderBy: { createdAt: "desc" },
      take: RELATED_TAGS_SAMPLE_TAKE,
      select: { tags: true },
    });
    if (sample.length >= RELATED_TAGS_MIN_SAMPLE) break;
  }

  const counts = new Map<string, number>();
  for (const p of sample) {
    for (const x of parseTags(p.tags)) {
      if (!x || x === t) continue;
      counts.set(x, (counts.get(x) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, RELATED_TAGS_MAX)
    .map(([x]) => x);
}
