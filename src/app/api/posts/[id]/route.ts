import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { assertNotBanned } from "@/lib/user-status";
import { PostMode, Prefecture } from "@prisma/client";
import { parseTags } from "@/lib/upload";
import { regionFromPrefecture } from "@/lib/prefectures";

export const runtime = "nodejs";

const updateSchema = z.object({
  prefecture: z.nativeEnum(Prefecture),
  mode: z.nativeEnum(PostMode),
  title: z.string().min(1).max(120),
  body: z.string().min(1).max(8000),

  reward: z.string().max(200).optional().default(""),
  place: z.string().max(200).optional().default(""),
  dateText: z.string().max(200).optional().default(""),
  tags: z.string().max(300).optional().default(""),

  contactText: z.string().min(1).max(500),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const active = await assertNotBanned(userId);
  if (!active.ok) return NextResponse.json({ error: active.error }, { status: 403 });

  const { id } = await params;

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing || !existing.isPublic) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (existing.authorId !== userId) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const json = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const tagList = parseTags(parsed.data.tags).join(",");

  const post = await prisma.post.update({
    where: { id },
    data: {
      region: regionFromPrefecture(parsed.data.prefecture),
      prefecture: parsed.data.prefecture,
      mode: parsed.data.mode,
      title: parsed.data.title,
      body: parsed.data.body,
      reward: parsed.data.reward,
      place: parsed.data.place,
      dateText: parsed.data.dateText,
      tags: tagList,
      contactText: parsed.data.contactText,
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, post });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const active = await assertNotBanned(userId);
  if (!active.ok) return NextResponse.json({ error: active.error }, { status: 403 });

  const { id } = await params;
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ ok: true });
  }
  if (existing.authorId !== userId) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
