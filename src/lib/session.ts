import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function getSession() {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id as string | undefined;
  if (!session?.user || !userId) return session;

  // Session-level validation: mark banned users.
  const u = await prisma.user.findUnique({ where: { id: userId }, select: { bannedAt: true } });
  if (u?.bannedAt) {
    (session as any).user.bannedAt = u.bannedAt;
  }

  return session as any;
}
