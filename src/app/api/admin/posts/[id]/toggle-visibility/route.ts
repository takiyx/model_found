import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export const runtime = "nodejs";

export async function POST(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const { ok } = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { id } = await ctx.params;
  const p = await prisma.post.findUnique({ where: { id }, select: { isPublic: true } });
  if (!p) return NextResponse.json({ error: "not_found" }, { status: 404 });

  await prisma.post.update({ where: { id }, data: { isPublic: !p.isPublic } });

  return NextResponse.redirect(new URL("/admin", process.env.NEXTAUTH_URL ?? "https://model-find.com"), 303);
}
