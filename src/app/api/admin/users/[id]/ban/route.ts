import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export const runtime = "nodejs";

export async function POST(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const { ok } = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { id } = await ctx.params;
  await prisma.user.update({ where: { id }, data: { bannedAt: new Date() } });

  return NextResponse.redirect(new URL("/admin/reports", process.env.NEXTAUTH_URL ?? "https://model-find.com"), 303);
}
