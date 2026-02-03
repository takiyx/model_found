import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { saveImageFiles } from "@/lib/upload";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const form = await req.formData();
  const file = form.get("avatar");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  // Use the same storage as post images; limit to 1
  const [stored] = await saveImageFiles([file]);
  if (!stored?.url) {
    return NextResponse.json({ error: "invalid_file" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: userId },
    data: { avatarUrl: stored.url },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, avatarUrl: stored.url });
}
