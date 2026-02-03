import { prisma } from "@/lib/db";

export async function isBlockedBetween(a: string, b: string) {
  if (!a || !b || a === b) return false;
  const hit = await prisma.blockUser.findFirst({
    where: {
      OR: [
        { blockerId: a, blockedId: b },
        { blockerId: b, blockedId: a },
      ],
    },
    select: { blockerId: true },
  });
  return !!hit;
}

export async function isBlockedBy({ blockerId, blockedId }: { blockerId: string; blockedId: string }) {
  if (!blockerId || !blockedId || blockerId === blockedId) return false;
  const hit = await prisma.blockUser.findUnique({
    where: { blockerId_blockedId: { blockerId, blockedId } },
    select: { blockerId: true },
  });
  return !!hit;
}
