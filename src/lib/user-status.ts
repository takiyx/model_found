import { prisma } from "@/lib/db";

export async function assertNotBanned(userId: string) {
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { bannedAt: true },
  });

  if (!u) return { ok: false as const, error: "unauthorized" as const };
  if (u.bannedAt) return { ok: false as const, error: "banned" as const };
  return { ok: true as const };
}
