import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().min(1).max(50),
  acceptAdult: z.boolean(),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const { email, password, displayName, acceptAdult } = parsed.data;

  if (!acceptAdult) {
    return NextResponse.json({ error: "accept_required" }, { status: 400 });
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ error: "email_taken" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      displayName,
      acceptedAdultAt: new Date(),
      // Default: both true; user can refine later.
      isPhotographer: true,
      isModel: true,
    },
    select: { id: true, email: true, displayName: true },
  });

  return NextResponse.json({ ok: true, user });
}
