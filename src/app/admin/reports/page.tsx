import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export const metadata = {
  title: "通報管理",
};

export default async function AdminReportsPage() {
  const { ok } = await requireAdmin();
  if (!ok) redirect("/login?callbackUrl=/admin/reports");

  const reports = await prisma.report.findMany({
    where: { status: "OPEN" },
    orderBy: { updatedAt: "desc" },
    take: 100,
    include: {
      post: { select: { id: true, title: true, isPublic: true, authorId: true } },
      reporter: { select: { id: true, displayName: true, email: true } },
      targetUser: { select: { id: true, displayName: true, email: true, bannedAt: true } },
    },
  });

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">通報管理</h1>
          <p className="text-sm text-zinc-600">OPEN の通報のみ表示します。</p>
        </div>
        <div className="flex gap-3 text-sm">
          <Link className="underline hover:text-zinc-900" href="/admin">
            管理トップ
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white">
        <div className="grid divide-y">
          {reports.length === 0 ? (
            <div className="p-4 text-sm text-zinc-600">OPEN の通報はありません。</div>
          ) : (
            reports.map((r) => (
              <div key={r.id} className="grid gap-2 p-4">
                <div className="text-xs text-zinc-500">{r.createdAt.toISOString()}</div>
                <div className="text-sm">
                  <span className="font-semibold">理由：</span>
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs">{r.reason}</span>
                </div>

                {r.post ? (
                  <div className="text-sm">
                    <div className="font-medium">
                      <Link className="hover:underline" href={`/posts/${r.post.id}`}>
                        {r.post.title}
                      </Link>
                      <span className="ml-2 text-xs text-zinc-500">({r.post.isPublic ? "公開" : "非公開"})</span>
                    </div>
                    <div className="text-xs text-zinc-500">postId: {r.post.id}</div>
                  </div>
                ) : (
                  <div className="text-sm text-zinc-600">（投稿に紐づかない通報）</div>
                )}

                <div className="grid gap-1 text-xs text-zinc-600">
                  <div>
                    <span className="font-semibold">報告者：</span>
                    {r.reporter.displayName} ({r.reporter.email})
                  </div>
                  <div>
                    <span className="font-semibold">対象ユーザー：</span>
                    {r.targetUser.displayName} ({r.targetUser.email})
                    {r.targetUser.bannedAt ? <span className="ml-2 text-red-700">BAN済</span> : null}
                  </div>
                </div>

                {r.detail ? (
                  <div className="rounded-xl border bg-zinc-50 p-3 text-sm text-zinc-700 whitespace-pre-wrap">{r.detail}</div>
                ) : null}

                <div className="flex flex-wrap gap-2 pt-1">
                  <form action={`/api/admin/reports/${r.id}/resolve`} method="post">
                    <button className="rounded-xl border px-3 py-1.5 text-sm hover:bg-zinc-50" type="submit">
                      解決（クローズ）
                    </button>
                  </form>
                  {r.post ? (
                    <>
                      <form action={`/api/admin/posts/${r.post.id}/toggle-visibility`} method="post">
                        <button className="rounded-xl border px-3 py-1.5 text-sm hover:bg-zinc-50" type="submit">
                          {r.post.isPublic ? "投稿を非公開" : "投稿を公開"}
                        </button>
                      </form>
                      <form action={`/api/admin/posts/${r.post.id}/delete`} method="post">
                        <button
                          className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-sm text-red-700 hover:bg-red-100"
                          type="submit"
                        >
                          投稿を削除
                        </button>
                      </form>
                    </>
                  ) : null}

                  <form action={`/api/admin/users/${r.targetUser.id}/ban`} method="post">
                    <button className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-sm text-red-700 hover:bg-red-100" type="submit">
                      ユーザーBAN
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
