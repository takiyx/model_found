import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { saveImageFiles } from "@/lib/upload";
import { assertNotBanned } from "@/lib/user-status";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const active = await assertNotBanned(userId);
  if (!active.ok) return NextResponse.json({ error: active.error }, { status: 403 });

  const form = await req.formData();
  const entries = form.getAll("images");
  const files = entries.filter((v): v is File => v instanceof File);

  const stored = await saveImageFiles(files.slice(0, 9));
  const urls = stored.map((s) => s.url);

  const user = await prisma.user.update({
    where: { id: userId },
    data: { portfolioImages: JSON.stringify(urls) },
    select: { portfolioImages: true },
  });

  const parsed = user.portfolioImages ? (JSON.parse(user.portfolioImages) as string[]) : [];
  return NextResponse.json({ ok: true, portfolioImages: parsed });
}

export async function DELETE() {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const active = await assertNotBanned(userId);
  if (!active.ok) return NextResponse.json({ error: active.error }, { status: 403 });

  await prisma.user.update({ where: { id: userId }, data: { portfolioImages: "[]" } });
  return NextResponse.json({ ok: true, portfolioImages: [] });
}
