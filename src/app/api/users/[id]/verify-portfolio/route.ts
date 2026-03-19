import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

export const runtime = "nodejs";

const schema = z.object({
  password: z.string().min(1).max(100),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const json = await req.json().catch(() => null);
  
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: { portfolioPassword: true, isPortfolioPrivate: true },
  });

  if (!user || !user.isPortfolioPrivate) {
    return NextResponse.json({ ok: true });
  }

  if (user.portfolioPassword === parsed.data.password) {
    return NextResponse.json({ ok: true });
  } else {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
}
