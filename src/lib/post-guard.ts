import { prisma } from "@/lib/db";

export function containsUrlLike(text: string) {
  const t = text.toLowerCase();
  // very small heuristic: any explicit scheme, www, or bare domain-ish token
  if (t.includes("http://") || t.includes("https://") || t.includes("www.")) return true;
  // bare domains (avoid matching emails by requiring a dot and a letter TLD)
  return /\b[a-z0-9-]+\.(com|net|org|jp|co|io|me|app|dev|xyz|info|biz)\b/i.test(t);
}

export function stripExternalUrls(text: string) {
  if (!text) return { text: "", changed: false };
  let out = text;
  const before = out;

  // Remove full URLs
  out = out.replace(/https?:\/\/[^\s)\]}>"']+/gi, "[外部リンク削除]");
  // Remove www.* tokens
  out = out.replace(/\bwww\.[^\s)\]}>"']+/gi, "[外部リンク削除]");
  // Remove bare domain tokens (keep emails intact)
  out = out.replace(/\b([a-z0-9-]+\.(com|net|org|jp|co|io|me|app|dev|xyz|info|biz))(\/[\w\-./?%&=+#]*)?\b/gi, "[外部リンク削除]");

  // Normalize repeated markers
  out = out.replace(/(\[外部リンク削除\])(\s*\[外部リンク削除\])+/g, "[外部リンク削除]");

  return { text: out, changed: out !== before };
}

export async function assertPostRateLimit(userId: string) {
  const now = Date.now();
  const oneHourAgo = new Date(now - 60 * 60 * 1000);

  const [user, recentCount] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { createdAt: true } }),
    prisma.post.count({ where: { authorId: userId, createdAt: { gte: oneHourAgo } } }),
  ]);

  // new users: stricter
  const isNew = user ? now - user.createdAt.getTime() < 24 * 60 * 60 * 1000 : false;

  const maxPerHour = isNew ? 1 : 5;
  if (recentCount >= maxPerHour) {
    return { ok: false as const, error: "rate_limited", maxPerHour };
  }

  return { ok: true as const, maxPerHour };
}

export async function shouldAutoHidePost(userId: string, input: { title: string; body: string; contactText: string }) {
  const strict = String(process.env.STRICT_LINK_REVIEW ?? "").toLowerCase();
  const strictOn = strict === "1" || strict === "true" || strict === "yes";

  const now = Date.now();
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { createdAt: true } });
  const isNew = user ? now - user.createdAt.getTime() < 24 * 60 * 60 * 1000 : false;

  const hasUrl = containsUrlLike(`${input.title}\n${input.body}\n${input.contactText}`);

  // Cold-start safe mode: hide any post that contains an external URL-like token.
  if (strictOn && hasUrl) return true;

  // Default: if a brand-new account tries to post anything that looks like an external URL,
  // hide it for review (reduces spam / scam blasts).
  if (isNew && hasUrl) return true;

  return false;
}
