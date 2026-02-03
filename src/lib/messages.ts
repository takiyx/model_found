import { prisma } from "@/lib/db";
import { assertMessageRateLimit } from "@/lib/rate-limit";
import { isBlockedBetween } from "@/lib/blocks";
import { assertNotBanned } from "@/lib/user-status";

export async function sendThreadMessage({
  threadId,
  senderId,
  body,
}: {
  threadId: string;
  senderId: string;
  body: string;
}) {
  const trimmed = body.trim();
  if (!trimmed) return { ok: false as const, error: "invalid_input" as const };

  const active = await assertNotBanned(senderId);
  if (!active.ok) return active;

  const participant = await prisma.threadParticipant.findUnique({
    where: { threadId_userId: { threadId, userId: senderId } },
    select: { threadId: true },
  });
  if (!participant) return { ok: false as const, error: "forbidden" as const };

  const other = await prisma.threadParticipant.findFirst({
    where: { threadId, userId: { not: senderId } },
    select: { userId: true },
  });
  const otherUserId = other?.userId;
  if (!otherUserId) return { ok: false as const, error: "invalid_state" as const };

  if (await isBlockedBetween(senderId, otherUserId)) {
    return { ok: false as const, error: "blocked" as const };
  }

  const rl = await assertMessageRateLimit(senderId);
  if (!rl.ok) return rl;

  const msg = await prisma.message.create({
    data: { threadId, senderId, body: trimmed },
    select: { id: true, createdAt: true },
  });

  await prisma.thread.update({ where: { id: threadId }, data: {} });

  const snippet = trimmed.slice(0, 120);
  await prisma.notification.upsert({
    where: {
      userId_kind_threadId: {
        userId: otherUserId,
        kind: "THREAD_MESSAGE",
        threadId,
      },
    },
    create: {
      userId: otherUserId,
      kind: "THREAD_MESSAGE",
      actorId: senderId,
      threadId,
      snippet,
      readAt: null,
    },
    update: {
      actorId: senderId,
      snippet,
      readAt: null,
    },
  });

  return { ok: true as const, message: msg };
}
