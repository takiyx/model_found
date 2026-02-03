import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { findOrCreateThreadForPost } from "@/lib/threads";

export const runtime = "nodejs";

const createSchema = z.object({
  postId: z.string().min(1),
});

export async function POST(req: Request) {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const thread = await findOrCreateThreadForPost({
    postId: parsed.data.postId,
    userId,
  });

  if (!thread) {
    return NextResponse.json({ error: "not_allowed" }, { status: 400 });
  }

  return NextResponse.json({ ok: true, thread });
}

export async function GET() {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const threads = await prisma.thread.findMany({
    where: { participants: { some: { userId } } },
    orderBy: { updatedAt: "desc" },
    take: 50,
    include: {
      post: { select: { id: true, title: true } },
      participants: {
        include: { user: { select: { id: true, displayName: true } } },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { body: true, createdAt: true, senderId: true },
      },
    },
  });

  return NextResponse.json({ ok: true, threads });
}
