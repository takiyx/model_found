import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { assertNotBanned } from "@/lib/user-status";
import { saveImageFiles, parseTags } from "@/lib/upload";
import { regionFromPrefecture } from "@/lib/prefectures";
import { assertPostRateLimit, shouldAutoHidePost, stripExternalUrls } from "@/lib/post-guard";

export const runtime = "nodejs";
import { PostMode, Prefecture } from "@prisma/client";

const jsonSchema = z.object({
  prefecture: z.nativeEnum(Prefecture),
  mode: z.nativeEnum(PostMode),
  title: z.string().min(1).max(120),
  body: z.string().min(1).max(8000),

  // optional
  reward: z.string().max(200).optional().default(""),
  place: z.string().max(200).optional().default(""),
  dateText: z.string().max(200).optional().default(""),
  tags: z.string().max(300).optional().default(""),

  // required by spec
  contactText: z.string().min(1).max(500),
});

export async function POST(req: Request) {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const active = await assertNotBanned(userId);
  if (!active.ok) return NextResponse.json({ error: active.error }, { status: 403 });

  const rl = await assertPostRateLimit(userId);
  if (!rl.ok) return NextResponse.json({ error: rl.error, maxPerHour: rl.maxPerHour }, { status: 429 });

  const contentType = req.headers.get("content-type") ?? "";

  // Support both JSON and multipart/form-data (for image uploads)
  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();

    const raw = {
      prefecture: form.get("prefecture"),
      mode: form.get("mode"),
      title: form.get("title"),
      body: form.get("body"),
      reward: form.get("reward") ?? "",
      place: form.get("place") ?? "",
      dateText: form.get("dateText") ?? "",
      tags: form.get("tags") ?? "",
      contactText: form.get("contactText") ?? "",
    };

    const parsed = jsonSchema.safeParse({
      ...raw,
      prefecture: String(raw.prefecture ?? ""),
      mode: String(raw.mode ?? ""),
      title: String(raw.title ?? ""),
      body: String(raw.body ?? ""),
      reward: String(raw.reward ?? ""),
      place: String(raw.place ?? ""),
      dateText: String(raw.dateText ?? ""),
      tags: String(raw.tags ?? ""),
      contactText: String(raw.contactText ?? ""),
    });

    if (!parsed.success) {
      return NextResponse.json({ error: "invalid_input" }, { status: 400 });
    }

    const fileEntries = form.getAll("images");
    const files = fileEntries.filter((v): v is File => v instanceof File);

    // MVP limits
    const limitedFiles = files.slice(0, 6);
    const stored = await saveImageFiles(limitedFiles);

    const tagList = parseTags(parsed.data.tags).join(",");

    const bodySan = stripExternalUrls(parsed.data.body);
    const contactSan = stripExternalUrls(parsed.data.contactText);
    const sanitized = bodySan.changed || contactSan.changed;

    const autoHide = await shouldAutoHidePost(userId, {
      title: parsed.data.title,
      body: bodySan.text,
      contactText: contactSan.text,
    });

    const post = await prisma.post.create({
      data: {
        region: regionFromPrefecture(parsed.data.prefecture),
        prefecture: parsed.data.prefecture,
        mode: parsed.data.mode,
        title: parsed.data.title,
        body: bodySan.text,
        reward: parsed.data.reward,
        place: parsed.data.place,
        dateText: parsed.data.dateText,
        tags: tagList,
        contactText: contactSan.text,
        authorId: userId,
        isPublic: !autoHide,
        images: {
          create: stored.map((s) => ({ url: s.url, alt: s.alt ?? "" })),
        },
      },
      select: { id: true },
    });

    return NextResponse.json({ ok: true, post, sanitized });
  }

  const json = await req.json().catch(() => null);
  const parsed = jsonSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const tagList = parseTags(parsed.data.tags).join(",");

  const bodySan = stripExternalUrls(parsed.data.body);
  const contactSan = stripExternalUrls(parsed.data.contactText);
  const sanitized = bodySan.changed || contactSan.changed;

  const autoHide = await shouldAutoHidePost(userId, {
    title: parsed.data.title,
    body: bodySan.text,
    contactText: contactSan.text,
  });

  const post = await prisma.post.create({
    data: {
      region: regionFromPrefecture(parsed.data.prefecture),
      prefecture: parsed.data.prefecture,
      mode: parsed.data.mode,
      title: parsed.data.title,
      body: bodySan.text,
      reward: parsed.data.reward,
      place: parsed.data.place,
      dateText: parsed.data.dateText,
      tags: tagList,
      contactText: contactSan.text,
      authorId: userId,
      isPublic: !autoHide,
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, post, sanitized });
}
