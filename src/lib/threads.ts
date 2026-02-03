import { prisma } from "@/lib/db";
import { isBlockedBetween } from "@/lib/blocks";
import { assertNotBanned } from "@/lib/user-status";

export async function findOrCreateThreadForPost({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) {
  const active = await assertNotBanned(userId);
  if (!active.ok) return null;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true, authorId: true, isPublic: true },
  });
  if (!post || !post.isPublic) return null;

  // Don't create a thread with yourself.
  if (post.authorId === userId) {
    // Still allow finding an existing thread, but in MVP we just return null.
    return null;
  }

  // Blocked users cannot message each other.
  if (await isBlockedBetween(userId, post.authorId)) {
    return null;
  }

  // Find an existing thread for this post with both participants.
  const existing = await prisma.thread.findFirst({
    where: {
      postId,
      participants: {
        some: { userId },
      },
      AND: {
        participants: {
          some: { userId: post.authorId },
        },
      },
    },
    select: { id: true },
  });

  if (existing) return existing;

  const created = await prisma.thread.create({
    data: {
      postId,
      participants: {
        create: [{ userId }, { userId: post.authorId }],
      },
    },
    select: { id: true },
  });

  return created;
}
