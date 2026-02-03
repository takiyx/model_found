import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

const TAGS = ["nude", "ポートレート", "studio"] as const;

type Tag = (typeof TAGS)[number];

export default async function AdminPicksPage() {
  const admin = await requireAdmin();
  if (!admin.ok) redirect("/");

  const picks = await prisma.weeklyPick.findMany({
    orderBy: [{ tag: "asc" }, { position: "asc" }],
    include: { post: { select: { id: true, title: true, author: { select: { displayName: true } }, createdAt: true, isPublic: true } } },
    take: 200,
  });

  async function addPick(formData: FormData) {
    "use server";
    const admin = await requireAdmin();
    if (!admin.ok) redirect("/");

    const tag = String(formData.get("tag") || "");
    const postId = String(formData.get("postId") || "").trim();
    if (!tag || !postId) redirect("/admin/picks");

    const max = await prisma.weeklyPick.aggregate({
      where: { tag },
      _max: { position: true },
    });
    const nextPos = (max._max.position ?? -1) + 1;

    await prisma.weeklyPick.create({
      data: { tag, postId, position: nextPos },
    }).catch(() => null);

    redirect("/admin/picks");
  }

  async function removePick(id: string) {
    "use server";
    const admin = await requireAdmin();
    if (!admin.ok) redirect("/");

    await prisma.weeklyPick.delete({ where: { id } }).catch(() => null);
    redirect("/admin/picks");
  }

  async function movePick(id: string, dir: "up" | "down") {
    "use server";
    const admin = await requireAdmin();
    if (!admin.ok) redirect("/");

    const cur = await prisma.weeklyPick.findUnique({ where: { id }, select: { id: true, tag: true, position: true } });
    if (!cur) redirect("/admin/picks");

    const swap = await prisma.weeklyPick.findFirst({
      where: {
        tag: cur.tag,
        position: dir === "up" ? { lt: cur.position } : { gt: cur.position },
      },
      orderBy: { position: dir === "up" ? "desc" : "asc" },
      select: { id: true, position: true },
    });

    if (!swap) redirect("/admin/picks");

    await prisma.$transaction([
      prisma.weeklyPick.update({ where: { id: cur.id }, data: { position: swap.position } }),
      prisma.weeklyPick.update({ where: { id: swap.id }, data: { position: cur.position } }),
    ]);

    redirect("/admin/picks");
  }

  function listFor(tag: Tag) {
    return picks.filter((p) => p.tag === tag);
  }

  return (
    <div className="grid gap-6">
      <header className="rounded-3xl border bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">今週のピックアップ（運営）</h1>
            <p className="mt-2 text-sm text-zinc-600">
              ホームの「今週のピックアップ」を手動で固定できます。表示されない場合は投稿が非公開の可能性があります。
            </p>
          </div>
          <Link className="rounded-full border px-3 py-1.5 text-sm hover:bg-zinc-50" href="/">
            ホームへ
          </Link>
        </div>
      </header>

      <section className="rounded-3xl border bg-white p-6">
        <h2 className="text-lg font-semibold">追加</h2>
        <form action={addPick} className="mt-3 flex flex-wrap items-end gap-2">
          <label className="grid gap-1">
            <span className="text-xs text-zinc-600">タグ</span>
            <select name="tag" className="rounded-xl border bg-white px-3 py-2 text-sm" defaultValue={TAGS[0]}>
              {TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-xs text-zinc-600">Post ID</span>
            <input name="postId" className="w-80 rounded-xl border px-3 py-2 text-sm" placeholder="posts/[id] の id" />
          </label>

          <button className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800" type="submit">
            追加
          </button>

          <div className="text-xs text-zinc-500">※ 投稿詳細に Post ID 表示・コピーがあります（作者/管理者のみ）。</div>
        </form>
      </section>

      <div className="grid gap-6">
        {TAGS.map((t) => (
          <section key={t} className="rounded-3xl border bg-white p-6">
            <div className="flex items-end justify-between">
              <h2 className="text-lg font-semibold">{t}</h2>
              <div className="text-xs text-zinc-500">上から順に表示</div>
            </div>

            {listFor(t).length === 0 ? (
              <div className="mt-4 text-sm text-zinc-600">まだ固定がありません（自動ピックアップになります）。</div>
            ) : (
              <ul className="mt-4 grid gap-3">
                {listFor(t).map((p) => (
                  <li key={p.id} className="rounded-2xl border bg-zinc-50 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-zinc-900">
                          {p.post.title}
                          {!p.post.isPublic ? <span className="ml-2 text-xs text-red-600">（非公開）</span> : null}
                        </div>
                        <div className="mt-1 text-xs text-zinc-500">
                          {p.post.author.displayName} ・ {new Date(p.post.createdAt).toLocaleDateString("ja-JP")} ・ {p.post.id}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link className="rounded-xl border bg-white px-3 py-1.5 text-sm hover:bg-zinc-50" href={`/posts/${p.post.id}`}>
                          投稿を見る
                        </Link>
                        <form action={movePick.bind(null, p.id, "up")}>
                          <button className="rounded-xl border bg-white px-3 py-1.5 text-sm hover:bg-zinc-50" type="submit">
                            ↑
                          </button>
                        </form>
                        <form action={movePick.bind(null, p.id, "down")}>
                          <button className="rounded-xl border bg-white px-3 py-1.5 text-sm hover:bg-zinc-50" type="submit">
                            ↓
                          </button>
                        </form>
                        <form action={removePick.bind(null, p.id)}>
                          <button className="rounded-xl border bg-white px-3 py-1.5 text-sm hover:bg-zinc-50" type="submit">
                            削除
                          </button>
                        </form>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
