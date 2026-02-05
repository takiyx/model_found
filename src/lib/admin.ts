import { getSession } from "@/lib/session";

function parseAdminEmails(raw: string | undefined) {
  return (raw ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined) {
  if (!email) return false;
  const allow = parseAdminEmails(process.env.ADMIN_EMAILS);
  if (allow.length === 0) return false;
  return allow.includes(String(email).trim().toLowerCase());
}

export async function requireAdmin() {
  const session = await getSession();
  const email = (session as any)?.user?.email as string | undefined;
  if (!session?.user || !isAdminEmail(email)) {
    return { ok: false as const, session };
  }
  return { ok: true as const, session };
}
