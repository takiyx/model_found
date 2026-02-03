import { getSession } from "@/lib/session";

function adminAllowlist() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  const allow = adminAllowlist();
  return allow.length > 0 && allow.includes(email);
}

export async function requireAdmin() {
  const session = await getSession();
  const email = session?.user?.email;

  if (!isAdminEmail(email)) {
    return { ok: false as const };
  }

  return { ok: true as const, session };
}
