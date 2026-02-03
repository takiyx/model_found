import { prisma } from "@/lib/db";

// Count threads that have unread messages for the user.
// MVP heuristic: a message is unread if it's newer than lastReadAt and not sent by the user.
export async function countUnreadThreads(userId: string) {
  const threads = await prisma.threadParticipant.findMany({
    where: { userId },
    select: { threadId: true, lastReadAt: true },
    take: 200,
  });

  let unread = 0;
  for (const t of threads) {
    const has = await prisma.message.findFirst({
      where: {
        threadId: t.threadId,
        createdAt: { gt: t.lastReadAt },
        senderId: { not: userId },
      },
      select: { id: true },
    });
    if (has) unread++;
  }

  return unread;
}
