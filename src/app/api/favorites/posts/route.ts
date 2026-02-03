import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { assertNotBanned } from "@/lib/user-status";

export const runtime = "nodejs";

const schema = z.object({
  postId: z.string().min(1),
});

export async function POST(req: Request) {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const active = await assertNotBanned(userId);
  if (!active.ok) return NextResponse.json({ error: active.error }, { status: 403 });

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const postId = parsed.data.postId;

  const exists = await prisma.favoritePost.findUnique({
    where: { userId_postId: { userId, postId } },
    select: { userId: true },
  });

  if (exists) {
    await prisma.favoritePost.delete({ where: { userId_postId: { userId, postId } } });
    return NextResponse.json({ ok: true, favorited: false });
  }

  await prisma.favoritePost.create({ data: { userId, postId } });

  const post = await prisma.post.findUnique({ where: { id: postId }, select: { authorId: true } });
  if (post?.authorId && post.authorId !== userId) {
    await prisma.notification.create({
      data: {
        userId: post.authorId,
        kind: "FAVORITE_POST",
        actorId: userId,
        postId,
      },
    });
  }

  return NextResponse.json({ ok: true, favorited: true });
}
