import { prisma } from "@/lib/db";

export async function assertMessageRateLimit(userId: string) {
  // MVP: 10 messages / 5 minutes
  const windowMs = 5 * 60 * 1000;
  const max = 10;
  const since = new Date(Date.now() - windowMs);

  const count = await prisma.message.count({
    where: { senderId: userId, createdAt: { gte: since } },
  });

  if (count >= max) {
    return { ok: false as const, error: "rate_limited" as const };
  }

  return { ok: true as const };
}

export async function assertReportRateLimit(userId: string) {
  // MVP: 5 reports / day
  const windowMs = 24 * 60 * 60 * 1000;
  const max = 5;
  const since = new Date(Date.now() - windowMs);

  const count = await prisma.report.count({
    where: { reporterId: userId, createdAt: { gte: since } },
  });

  if (count >= max) {
    return { ok: false as const, error: "rate_limited" as const };
  }

  return { ok: true as const };
}
