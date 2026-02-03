import Link from "next/link";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; ok?: string; error?: string }>;
}) {
  const admin = await requireAdmin();
  if (!admin.ok) redirect("/");

  const sp = await searchParams;
  const q = (sp.q ?? "").trim();

  const users = await prisma.user.findMany({
    where: q
      ? {
          OR: [
            { email: { contains: q } },
            { displayName: { contains: q } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      email: true,
      displayName: true,
      createdAt: true,
      bannedAt: true,
    },
  });

  async function resetPassword(formData: FormData) {
    "use server";
    const admin = await requireAdmin();
    if (!admin.ok) redirect("/");

    const userId = String(formData.get("userId") ?? "");
    const newPassword = String(formData.get("newPassword") ?? "");

    if (!userId || newPassword.length < 6) {
      redirect("/admin/users?error=invalid");
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    redirect("/admin/users?ok=1");
  }

  return (
    <div className="grid gap-6">
      <header className="rounded-3xl border bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Users (admin)</h1>
            <p className="mt-2 text-sm text-zinc-600">
              パスワード再設定（メール機能なしのMVP向け）。
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link className="rounded-full border px-3 py-1.5 text-sm hover:bg-zinc-50" href="/admin/picks">
              今週のピックアップ
            </Link>
            <Link className="rounded-full border px-3 py-1.5 text-sm hover:bg-zinc-50" href="/admin/reports">
              Reports
            </Link>
          </div>
        </div>

        <form className="mt-4 flex gap-2" action="/admin/users">
          <input
            name="q"
            defaultValue={q}
            className="flex-1 rounded-xl border px-3 py-2 text-sm"
            placeholder="email / 表示名で検索"
          />
          <button className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800">
            検索
          </button>
        </form>

        {sp.ok === "1" ? (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
            パスワードを更新しました。
          </div>
        ) : sp.error === "invalid" ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-900">
            入力が不正です（パスワードは6文字以上）。
          </div>
        ) : null}
      </header>

      <section className="overflow-hidden rounded-3xl border bg-white">
        {users.length === 0 ? (
          <div className="px-6 py-10 text-sm text-zinc-600">該当ユーザーがいません。</div>
        ) : (
          <ul className="divide-y">
            {users.map((u) => (
              <li key={u.id} className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-zinc-900">{u.displayName}</div>
                    <div className="mt-1 text-xs text-zinc-500">
                      {u.email} ・ {new Date(u.createdAt).toLocaleString("ja-JP")}
                      {u.bannedAt ? <span className="ml-2 text-red-600">（BAN中）</span> : null}
                    </div>
                    <div className="mt-1 text-xs text-zinc-400">{u.id}</div>
                  </div>

                  <form action={resetPassword} className="flex flex-wrap items-end gap-2">
                    <input type="hidden" name="userId" value={u.id} />
                    <label className="grid gap-1">
                      <span className="text-xs text-zinc-600">新パスワード</span>
                      <input name="newPassword" className="w-56 rounded-xl border px-3 py-2 text-sm" placeholder="6文字以上" />
                    </label>
                    <button className="rounded-xl border px-3 py-2 text-sm hover:bg-zinc-50" type="submit">
                      再設定
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
