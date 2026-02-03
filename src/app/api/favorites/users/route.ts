import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { assertNotBanned } from "@/lib/user-status";

export const runtime = "nodejs";

const schema = z.object({
  targetUserId: z.string().min(1),
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

  const targetUserId = parsed.data.targetUserId;
  if (targetUserId === userId) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const exists = await prisma.favoriteUser.findUnique({
    where: { userId_targetUserId: { userId, targetUserId } },
    select: { userId: true },
  });

  if (exists) {
    await prisma.favoriteUser.delete({ where: { userId_targetUserId: { userId, targetUserId } } });
    return NextResponse.json({ ok: true, favorited: false });
  }

  await prisma.favoriteUser.create({ data: { userId, targetUserId } });

  // Notification
  await prisma.notification.create({
    data: {
      userId: targetUserId,
      kind: "FAVORITE_USER",
      actorId: userId,
    },
  });

  return NextResponse.json({ ok: true, favorited: true });
}
