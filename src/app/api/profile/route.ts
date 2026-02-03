import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { Prefecture } from "@prisma/client";

export const runtime = "nodejs";

const schema = z.object({
  displayName: z.string().min(1).max(50),
  bio: z.string().max(1000).optional().default(""),
  prefecture: z.nativeEnum(Prefecture).optional().nullable(),
  basePlace: z.string().max(100).optional().default(""),
  interests: z.string().max(300).optional().default(""),
  isPhotographer: z.boolean().optional().default(true),
  isModel: z.boolean().optional().default(true),
  avatarUrl: z.string().max(500).optional().default(""),

  websiteUrl: z.string().max(500).optional().default(""),
  instagramHandle: z.string().max(50).optional().default(""),
  xHandle: z.string().max(50).optional().default(""),
  portfolioText: z.string().max(2000).optional().default(""),
  portfolioImages: z.string().max(5000).optional().default("[]"),

  shootOkText: z.string().max(2000).optional().default(""),
  shootNgText: z.string().max(2000).optional().default(""),
});

export async function PUT(req: Request) {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  // Require at least one role
  if (!parsed.data.isPhotographer && !parsed.data.isModel) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      displayName: parsed.data.displayName,
      bio: parsed.data.bio,
      prefecture: parsed.data.prefecture ?? null,
      basePlace: parsed.data.basePlace,
      interests: parsed.data.interests,
      isPhotographer: parsed.data.isPhotographer,
      isModel: parsed.data.isModel,
      avatarUrl: parsed.data.avatarUrl,
      websiteUrl: parsed.data.websiteUrl,
      instagramHandle: parsed.data.instagramHandle,
      xHandle: parsed.data.xHandle,
      portfolioText: parsed.data.portfolioText,
      portfolioImages: parsed.data.portfolioImages,
      shootOkText: parsed.data.shootOkText,
      shootNgText: parsed.data.shootNgText,
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true });
}
