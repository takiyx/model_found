import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id: threadId } = await params;

  const participant = await prisma.threadParticipant.findUnique({
    where: { threadId_userId: { threadId, userId } },
    select: { threadId: true },
  });
  if (!participant) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const thread = await prisma.thread.findUnique({
    where: { id: threadId },
    include: {
      post: { select: { id: true, title: true } },
      participants: { include: { user: { select: { id: true, displayName: true } } } },
      messages: {
        orderBy: { createdAt: "asc" },
        take: 200,
        include: { sender: { select: { id: true, displayName: true } } },
      },
    },
  });

  if (!thread) return NextResponse.json({ error: "not_found" }, { status: 404 });

  return NextResponse.json({ ok: true, thread });
}
