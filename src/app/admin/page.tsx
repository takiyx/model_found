import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export const metadata = {
  title: "管理",
  description: "管理者用ページ",
};

export default async function AdminPage() {
  const { ok } = await requireAdmin();
  if (!ok) redirect("/login?callbackUrl=/admin");

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { author: true, images: true },
  });

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="grid gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">管理</h1>
          <p className="text-sm text-zinc-600">直近の投稿を管理します（削除 / 非公開）。</p>
        </div>
        <Link className="text-sm text-zinc-600 hover:text-zinc-900 underline" href="/changelog">
          更新ログ
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white">
        <div className="grid divide-y">
          {posts.map((p) => (
            <div key={p.id} className="grid gap-2 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm text-zinc-500">
                    {p.createdAt.toISOString()} ・ {p.author.displayName} ({p.author.email})
                  </div>
                  <div className="font-medium truncate">
                    <Link className="hover:underline" href={`/posts/${p.id}`}>
                      {p.title}
                    </Link>
                  </div>
                  <div className="text-xs text-zinc-500">
                    {p.isPublic ? "公開" : "非公開"} ・ images: {p.images.length}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <form action={`/api/admin/posts/${p.id}/toggle-visibility`} method="post">
                    <button
                      className="rounded-xl border px-3 py-1.5 text-sm hover:bg-zinc-50"
                      type="submit"
                    >
                      {p.isPublic ? "非公開にする" : "公開に戻す"}
                    </button>
                  </form>
                  <form action={`/api/admin/posts/${p.id}/delete`} method="post">
                    <button
                      className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-sm text-red-700 hover:bg-red-100"
                      type="submit"
                      onClick={(e) => {
                        if (!confirm("本当に削除しますか？")) e.preventDefault();
                      }}
                    >
                      削除
                    </button>
                  </form>
                </div>
              </div>

              <div className="text-sm text-zinc-700 line-clamp-2">{p.body}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-4 text-sm text-zinc-600">
        <div className="font-medium text-zinc-900">メモ</div>
        <ul className="mt-2 list-disc pl-5">
          <li>管理権限は環境変数 <code>ADMIN_EMAILS</code>（カンマ区切り）で制御します。</li>
          <li>将来的には「通報一覧」「ユーザーBAN」などもここに追加できます。</li>
        </ul>
      </div>
    </div>
  );
}
