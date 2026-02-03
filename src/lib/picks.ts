import { prisma } from "@/lib/db";
import { parseTags } from "@/lib/upload";

function parseJson(raw: string) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Env format (legacy):
// WEEKLY_PICKS={"nude":["postId1","postId2"],"ポートレート":["..."],"studio":["..."]}
export function getWeeklyPickIdsFromEnv(tag: string): string[] {
  const raw = process.env.WEEKLY_PICKS;
  if (!raw) return [];
  const obj = parseJson(raw);
  if (!obj || typeof obj !== "object") return [];

  const v = (obj as any)[tag];
  if (!Array.isArray(v)) return [];
  return v.map((x: any) => String(x)).filter(Boolean);
}

export async function getWeeklyPicks({
  tag,
  select,
  take = 3,
}: {
  tag: string;
  select: any;
  take?: number;
}) {
  // 1) DB picks (preferred)
  const rows = await prisma.weeklyPick.findMany({
    where: { tag },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
    take,
    include: { post: { select } },
  });

  const pinnedOrdered = rows.map((r) => r.post);

  // 2) Env picks (fallback, only if DB has none)
  const envPinnedIds = pinnedOrdered.length === 0 ? getWeeklyPickIdsFromEnv(tag) : [];
  const envPinned = envPinnedIds.length
    ? await prisma.post.findMany({
        where: { id: { in: envPinnedIds }, isPublic: true },
        select,
      })
    : [];
  const idx = new Map(envPinnedIds.map((id, i) => [id, i]));
  const envPinnedOrdered = envPinned.sort((a: any, b: any) => (idx.get(a.id) ?? 1e9) - (idx.get(b.id) ?? 1e9));

  const pinned = pinnedOrdered.length ? pinnedOrdered : envPinnedOrdered;
  const pinnedIds = pinned.map((p: any) => p.id);

  // Backfill with recent posts for this tag (strict match)
  const need = Math.max(0, take - pinned.length);
  const backfillRough = need
    ? await prisma.post.findMany({
        where: { isPublic: true, tags: { contains: tag }, id: { notIn: pinnedIds } },
        orderBy: { createdAt: "desc" },
        take: 20,
        select,
      })
    : [];
  const backfill = backfillRough.filter((p: any) => parseTags(p.tags).includes(tag)).slice(0, need);

  return [...pinned.slice(0, take), ...backfill];
}
