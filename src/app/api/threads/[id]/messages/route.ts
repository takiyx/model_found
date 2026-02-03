import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { sendThreadMessage } from "@/lib/messages";
import { assertNotBanned } from "@/lib/user-status";

export const runtime = "nodejs";

const schema = z.object({
  body: z.string().min(1).max(2000),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const active = await assertNotBanned(userId);
  if (!active.ok) return NextResponse.json({ error: active.error }, { status: 403 });

  const { id: threadId } = await params;

  const participant = await prisma.threadParticipant.findUnique({
    where: { threadId_userId: { threadId, userId } },
    select: { threadId: true },
  });
  if (!participant) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const result = await sendThreadMessage({
    threadId,
    senderId: userId,
    body: parsed.data.body,
  });

  if (!result.ok) {
    const status = result.error === "rate_limited" ? 429 : result.error === "blocked" ? 403 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json({ ok: true, message: result.message });
}
