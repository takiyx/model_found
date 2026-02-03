import { prisma } from "@/lib/db";
import { isBlockedBetween } from "@/lib/blocks";

// A can view B's contact on a post only after:
// - A sent at least one message to B about that post
// - B replied at least once in the same thread
export async function canViewContact({
  postId,
  viewerId,
}: {
  postId: string;
  viewerId: string;
}) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true, isPublic: true },
  });
  if (!post || !post.isPublic) return false;

  // Author can always view their own contact
  if (post.authorId === viewerId) return true;

  // Blocked users cannot see contact info
  if (await isBlockedBetween(viewerId, post.authorId)) return false;

  // Find a thread for this post with both participants
  const thread = await prisma.thread.findFirst({
    where: {
      postId,
      participants: { some: { userId: viewerId } },
      AND: { participants: { some: { userId: post.authorId } } },
    },
    select: { id: true },
  });
  if (!thread) return false;

  const sentByViewer = await prisma.message.findFirst({
    where: { threadId: thread.id, senderId: viewerId },
    select: { id: true },
  });
  if (!sentByViewer) return false;

  const repliedByAuthor = await prisma.message.findFirst({
    where: { threadId: thread.id, senderId: post.authorId },
    select: { id: true },
  });

  return !!repliedByAuthor;
}
