import Link from "next/link";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { markAllNotificationsRead } from "@/lib/notifications";

function label(kind: string) {
  if (kind === "FAVORITE_USER") return "保存";
  if (kind === "FAVORITE_POST") return "投稿の保存";
  if (kind === "THREAD_MESSAGE") return "新しいメッセージ";
  return kind;
}

function hrefOf(n: any) {
  if (n.kind === "FAVORITE_USER" && n.actorId) return `/u/${n.actorId}`;
  if (n.kind === "FAVORITE_POST" && n.postId) return `/posts/${n.postId}`;
  if (n.kind === "THREAD_MESSAGE" && n.threadId) return `/inbox/${n.threadId}`;
  return "/";
}

export default async function NotificationsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login?callbackUrl=/notifications");
  const userId = session.user.id;

  // MVP: mark all read when opening the page.
  await markAllNotificationsRead(userId);

  const items = await prisma.notification.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: 80,
    include: {
      actor: { select: { id: true, displayName: true } },
      post: { select: { id: true, title: true } },
    },
  });

  return (
    <div className="grid gap-6">
      <header className="rounded-3xl border bg-white p-6">
        <h1 className="text-2xl font-semibold">通知</h1>
        <p className="mt-2 text-sm text-zinc-600">保存やメッセージなどの最新情報です。</p>
      </header>

      {items.length === 0 ? (
        <div className="rounded-3xl border bg-white p-10 text-sm text-zinc-600">まだ通知がありません。</div>
      ) : (
        <div className="overflow-hidden rounded-3xl border bg-white">
          <ul className="divide-y">
            {items.map((n) => (
              <li key={n.id} className="px-6 py-4">
                <Link className="block" href={hrefOf(n)}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-zinc-500">{label(n.kind)}</div>
                      <div className="mt-1 text-sm text-zinc-900">
                        {n.kind === "THREAD_MESSAGE" ? (
                          <>
                            {n.actor?.displayName ?? "（相手）"} から新しいメッセージ
                          </>
                        ) : n.kind === "FAVORITE_USER" ? (
                          <>
                            {n.actor?.displayName ?? "誰か"} があなたを保存しました
                          </>
                        ) : n.kind === "FAVORITE_POST" ? (
                          <>
                            {n.actor?.displayName ?? "誰か"} が投稿を保存しました：
                            <span className="font-medium">{n.post?.title ?? ""}</span>
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                      {n.snippet ? (
                        <div className="mt-2 truncate text-sm text-zinc-600">{n.snippet}</div>
                      ) : null}
                    </div>

                    <div className="shrink-0 text-xs text-zinc-500">
                      {new Date(n.updatedAt).toLocaleString("ja-JP")}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
