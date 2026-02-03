import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { assertReportRateLimit } from "@/lib/rate-limit";

const reasons = [
  { value: "SPAM", label: "スパム/宣伝" },
  { value: "SCAM", label: "詐欺/金銭目的" },
  { value: "HARASSMENT", label: "迷惑行為/嫌がらせ" },
  { value: "IMPERSONATION", label: "なりすまし" },
  { value: "ILLEGAL", label: "違法の疑い" },
  { value: "UNDERAGE", label: "未成年の疑い" },
  { value: "OTHER", label: "その他" },
] as const;

import { NoticeBanner } from "@/components/notice-banner";

export default async function ReportPage({
  searchParams,
}: {
  searchParams: Promise<{ postId?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const postId = sp.postId;
  const error = sp.error;
  if (!postId) redirect("/");

  const session = await getSession();
  if (!session?.user) redirect(`/login?callbackUrl=${encodeURIComponent(`/report?postId=${postId}`)}`);

  const post = await prisma.post.findFirst({
    where: { id: postId, isPublic: true },
    include: { author: { select: { id: true, displayName: true } } },
  });
  if (!post) redirect("/");

  async function createReport(formData: FormData) {
    "use server";
    const rawReason = formData.get("reason");
    const detail = String(formData.get("detail") || "").slice(0, 2000);

    const session = await getSession();
    const reporterId = session?.user?.id;
    if (!reporterId) redirect("/login");

    const rl = await assertReportRateLimit(reporterId);
    if (!rl.ok) {
      redirect(`/report?postId=${postId}&error=rate_limited`);
    }

    // Banned users cannot submit reports
    const u = await prisma.user.findUnique({ where: { id: reporterId }, select: { bannedAt: true } });
    if (u?.bannedAt) {
      redirect(`/report?postId=${postId}&error=banned`);
    }

    const allowed = new Set(reasons.map((r) => r.value));
    if (typeof rawReason !== "string" || !allowed.has(rawReason as any)) {
      redirect(`/report?postId=${postId}`);
    }
    const reason = rawReason as (typeof reasons)[number]["value"];

    const p = await prisma.post.findUnique({ where: { id: postId }, select: { authorId: true } });
    if (!p) redirect("/");

    await prisma.report.create({
      data: {
        reporterId,
        targetUserId: p.authorId,
        postId,
        reason: reason as any,
        detail,
      },
    });

    redirect(`/posts/${postId}?reported=1`);
  }

  return (
    <div className="grid gap-6">
      {error === "rate_limited" ? (
        <NoticeBanner tone="warning" title="報告回数が多すぎます">
          申し訳ありません。時間をおいてから再度お試しください。
        </NoticeBanner>
      ) : error === "banned" ? (
        <NoticeBanner tone="danger" title="このアカウントは現在制限されています" />
      ) : null}

      <header className="rounded-3xl border bg-white p-6">
        <h1 className="text-2xl font-semibold">報告</h1>
        <p className="mt-2 text-sm text-zinc-600">
          不審な投稿や迷惑行為を運営へ報告します。内容を確認して対応します。
        </p>
      </header>

      <section className="rounded-3xl border bg-white p-6">
        <div className="text-sm text-zinc-600">対象の投稿</div>
        <div className="mt-2 text-sm text-zinc-900 font-medium">{post.title}</div>
        <div className="mt-1 text-xs text-zinc-500">投稿者：{post.author.displayName}</div>

        <form action={createReport} className="mt-6 grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-medium">理由</span>
            <select name="reason" className="rounded-xl border bg-white px-3 py-2 text-sm" defaultValue="SPAM">
              {reasons.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium">詳細（任意）</span>
            <textarea
              name="detail"
              rows={6}
              className="rounded-xl border bg-white px-3 py-2 text-sm"
              placeholder="どの部分が問題か、経緯などを書いてください（任意）"
            />
            <span className="text-xs text-zinc-500">個人情報は必要最小限にしてください。</span>
          </label>

          <div className="flex items-center gap-2">
            <button className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800" type="submit">
              送信する
            </button>
            <Link className="rounded-xl border px-4 py-2 text-sm hover:bg-zinc-50" href={`/posts/${postId}`}>
              戻る
            </Link>
          </div>
        </form>
      </section>

      <section className="rounded-3xl border bg-white p-6">
        <h2 className="text-lg font-semibold">安全ガイド</h2>
        <p className="mt-2 text-sm text-zinc-600">
          先に <Link className="underline" href="/rules">安全ガイド / ルール</Link> も確認できます。
        </p>
      </section>
    </div>
  );
}
