import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; hasPost?: string }>;
}) {
  const admin = await requireAdmin();
  if (!admin.ok) redirect("/");

  const sp = await searchParams;
  const status = sp.status === "open" ? "open" : "all";
  const hasPost = sp.hasPost === "1";

  const where: any = {};
  if (status === "open") where.status = "OPEN";
  if (hasPost) where.postId = { not: null };

  const reports = await prisma.report.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 80,
    include: {
      reporter: { select: { id: true, email: true, displayName: true } },
      targetUser: { select: { id: true, email: true, displayName: true, bannedAt: true } },
      post: { select: { id: true, title: true, isPublic: true } },
    },
  });

  async function resolve(id: string) {
    "use server";
    const admin = await requireAdmin();
    if (!admin.ok) redirect("/");

    await prisma.report.update({
      where: { id },
      data: { status: "RESOLVED", resolvedAt: new Date() },
    });

    redirect("/admin/reports");
  }

  async function hidePost(postId: string) {
    "use server";
    const admin = await requireAdmin();
    if (!admin.ok) redirect("/");
    await prisma.post.update({ where: { id: postId }, data: { isPublic: false } });
    redirect("/admin/reports");
  }

  async function unhidePost(postId: string) {
    "use server";
    const admin = await requireAdmin();
    if (!admin.ok) redirect("/");
    await prisma.post.update({ where: { id: postId }, data: { isPublic: true } });
    redirect("/admin/reports");
  }

  async function banUser(userId: string) {
    "use server";
    const admin = await requireAdmin();
    if (!admin.ok) redirect("/");
    await prisma.user.update({ where: { id: userId }, data: { bannedAt: new Date() } });
    redirect("/admin/reports");
  }

  async function unbanUser(userId: string) {
    "use server";
    const admin = await requireAdmin();
    if (!admin.ok) redirect("/");
    await prisma.user.update({ where: { id: userId }, data: { bannedAt: null } });
    redirect("/admin/reports");
  }

  return (
    <div className="grid gap-6">
      <header className="rounded-3xl border bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Reports (admin)</h1>
            <p className="mt-2 text-sm text-zinc-600">
              簡易運用：一覧 + 解決済み。アクセス制限は ADMIN_EMAILS 環境変数で行います。
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              className={
                "rounded-full border px-3 py-1.5 text-sm hover:bg-zinc-50 " +
                (status === "all" ? "bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800" : "")
              }
              href="/admin/reports"
            >
              全件
            </Link>
            <Link
              className={
                "rounded-full border px-3 py-1.5 text-sm hover:bg-zinc-50 " +
                (status === "open" ? "bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800" : "")
              }
              href={hasPost ? "/admin/reports?status=open&hasPost=1" : "/admin/reports?status=open"}
            >
              未処理のみ
            </Link>
            <Link
              className={
                "rounded-full border px-3 py-1.5 text-sm hover:bg-zinc-50 " +
                (hasPost ? "bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800" : "")
              }
              href={status === "open" ? "/admin/reports?status=open&hasPost=1" : "/admin/reports?hasPost=1"}
            >
              投稿あり
            </Link>
          </div>
        </div>
      </header>

      <div className="overflow-hidden rounded-3xl border bg-white">
        <ul className="divide-y">
          {reports.map((r) => (
            <li key={r.id} className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-medium text-zinc-500">
                    {r.status} / {new Date(r.createdAt).toLocaleString("ja-JP")}
                  </div>
                  <div className="mt-1 text-sm font-medium text-zinc-900">
                    {r.reason}
                    {r.post ? (
                      <>
                        {" "}
                        - <Link className="underline" href={`/posts/${r.post.id}`}>
                          {r.post.title}
                        </Link>
                      </>
                    ) : null}
                  </div>

                  {r.detail ? (
                    <div className="mt-2 whitespace-pre-wrap text-sm text-zinc-700">{r.detail}</div>
                  ) : (
                    <div className="mt-2 text-sm text-zinc-500">（詳細なし）</div>
                  )}

                  <div className="mt-3 text-xs text-zinc-500">
                    reporter: {r.reporter.displayName} ({r.reporter.email}) / target: {r.targetUser.displayName} ({r.targetUser.email})
                  </div>
                </div>

                <div className="grid gap-2">
                  {r.post ? (
                    <form action={(r.post.isPublic ? hidePost : unhidePost).bind(null, r.post.id)}>
                      <button className="rounded-xl border px-3 py-1.5 text-sm hover:bg-zinc-50" type="submit">
                        {r.post.isPublic ? "投稿を非表示" : "投稿を再表示"}
                      </button>
                    </form>
                  ) : null}

                  <form action={(r.targetUser.bannedAt ? unbanUser : banUser).bind(null, r.targetUser.id)}>
                    <button className="rounded-xl border px-3 py-1.5 text-sm hover:bg-zinc-50" type="submit">
                      {r.targetUser.bannedAt ? "ユーザーを解除" : "ユーザーをBAN"}
                    </button>
                  </form>

                  {r.status === "OPEN" ? (
                    <form action={resolve.bind(null, r.id)}>
                      <button className="rounded-xl border px-3 py-1.5 text-sm hover:bg-zinc-50" type="submit">
                        解決済みにする
                      </button>
                    </form>
                  ) : (
                    <div className="text-xs text-zinc-500">resolved</div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
