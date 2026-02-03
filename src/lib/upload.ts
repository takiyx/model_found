import path from "path";
import crypto from "crypto";
import { promises as fs } from "fs";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export type StoredUpload = {
  url: string;
  alt?: string;
};

function safeExt(mime: string) {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  return null;
}

export async function saveImageFiles(files: File[]): Promise<StoredUpload[]> {
  if (files.length === 0) return [];

  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  const out: StoredUpload[] = [];
  for (const f of files) {
    const ext = safeExt(f.type);
    if (!ext) continue;

    // Limit (MVP): 8MB per image
    if (f.size > 8 * 1024 * 1024) continue;

    const buf = Buffer.from(await f.arrayBuffer());
    const name = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;
    const abs = path.join(UPLOAD_DIR, name);

    await fs.writeFile(abs, buf);

    out.push({
      url: `/uploads/${name}`,
      alt: f.name || "",
    });
  }

  return out;
}

export function normalizeTag(raw: string) {
  let t = String(raw ?? "").trim();
  if (!t) return "";

  // Normalize some common variants (ops-focused)
  const lower = t.toLowerCase();

  // studio variants → "studio"
  if (lower === "studio" || lower === "studios") return "studio";
  if (t === "スタジオ" || t === "STUDIO") return "studio";

  // nude variants → "nude"
  if (lower === "nude") return "nude";
  if (t === "ヌード" || t === "裸") return "nude";

  // portrait variants → "ポートレート"
  if (lower === "portrait") return "ポートレート";
  if (t === "ポートレイト") return "ポートレート";

  // Keep original (trimmed)
  return t;
}

export function parseTags(raw: string) {
  return raw
    .split(",")
    .map((t) => normalizeTag(t))
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 12);
}
