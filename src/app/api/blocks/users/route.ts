import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const schema = z.object({
  blockedId: z.string().min(1),
});

export async function POST(req: Request) {
  const session = await getSession();
  const blockerId = session?.user?.id;
  if (!blockerId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const blockedId = parsed.data.blockedId;
  if (blockedId === blockerId) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const exists = await prisma.blockUser.findUnique({
    where: { blockerId_blockedId: { blockerId, blockedId } },
    select: { blockerId: true },
  });

  if (exists) {
    await prisma.blockUser.delete({ where: { blockerId_blockedId: { blockerId, blockedId } } });
    return NextResponse.json({ ok: true, blocked: false });
  }

  await prisma.blockUser.create({ data: { blockerId, blockedId } });
  return NextResponse.json({ ok: true, blocked: true });
}
