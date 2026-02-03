import Link from "next/link";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { NoticeBanner } from "@/components/notice-banner";

export default async function SecurityPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const session = await getSession();
  if (!session?.user) redirect("/login?callbackUrl=/settings/security");
  const userId = session.user.id;

  const sp = await searchParams;
  const ok = sp.ok === "1";
  const error = sp.error;

  async function changePassword(formData: FormData) {
    "use server";
    const session = await getSession();
    const userId = session?.user?.id;
    if (!userId) redirect("/login");

    const current = String(formData.get("currentPassword") ?? "");
    const next = String(formData.get("newPassword") ?? "");

    if (next.length < 6) {
      redirect("/settings/security?error=weak");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true },
    });
    if (!user) redirect("/settings/security?error=unknown");

    const valid = await bcrypt.compare(current, user.passwordHash);
    if (!valid) {
      redirect("/settings/security?error=bad_current");
    }

    const passwordHash = await bcrypt.hash(next, 10);
    await prisma.user.update({ where: { id: userId }, data: { passwordHash } });

    redirect("/settings/security?ok=1");
  }

  return (
    <div className="grid gap-6">
      <header className="rounded-3xl border bg-white p-6">
        <h1 className="text-2xl font-semibold">セキュリティ</h1>
        <p className="mt-2 text-sm text-zinc-600">パスワード変更などを行えます。</p>
      </header>

      {ok ? <NoticeBanner tone="success" title="パスワードを変更しました" /> : null}
      {error === "bad_current" ? (
        <NoticeBanner tone="danger" title="現在のパスワードが違います" />
      ) : error === "weak" ? (
        <NoticeBanner tone="warning" title="新しいパスワードは6文字以上にしてください" />
      ) : null}

      <section className="rounded-3xl border bg-white p-6">
        <h2 className="text-lg font-semibold">パスワード変更</h2>
        <form action={changePassword} className="mt-4 grid gap-3 max-w-lg">
          <label className="grid gap-1 text-sm">
            <span className="text-zinc-700">現在のパスワード</span>
            <input name="currentPassword" type="password" className="rounded-xl border px-3 py-2" required />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-zinc-700">新しいパスワード</span>
            <input name="newPassword" type="password" className="rounded-xl border px-3 py-2" required />
            <span className="text-xs text-zinc-500">6文字以上</span>
          </label>
          <button className="w-fit rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800" type="submit">
            変更する
          </button>
        </form>

        <div className="mt-6 text-sm">
          <Link className="underline" href={`/u/${userId}`}>
            プロフィールへ戻る
          </Link>
        </div>
      </section>
    </div>
  );
}
