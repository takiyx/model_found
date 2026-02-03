import Link from "next/link";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export default async function InboxPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login?callbackUrl=/inbox");
  const userId = session.user.id;

  const threads = await prisma.thread.findMany({
    where: { participants: { some: { userId } } },
    orderBy: { updatedAt: "desc" },
    take: 50,
    include: {
      post: { select: { id: true, title: true } },
      participants: {
        include: { user: { select: { id: true, displayName: true } } },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { body: true, createdAt: true, senderId: true },
      },
    },
  });

  const myRead = await prisma.threadParticipant.findMany({
    where: { userId, threadId: { in: threads.map((t) => t.id) } },
    select: { threadId: true, lastReadAt: true },
  });
  const readMap = new Map(myRead.map((r) => [r.threadId, r.lastReadAt]));

  // Block markers (MVP)
  const otherIds = threads
    .map((t) => t.participants.map((p) => p.user).find((u) => u.id !== userId)?.id)
    .filter(Boolean) as string[];

  const blockedUserIds = new Set<string>();
  if (otherIds.length) {
    const blocks = await prisma.blockUser.findMany({
      where: {
        OR: [
          { blockerId: userId, blockedId: { in: otherIds } },
          { blockedId: userId, blockerId: { in: otherIds } },
        ],
      },
      select: { blockerId: true, blockedId: true },
    });

    blocks.forEach((b) => {
      const other = b.blockerId === userId ? b.blockedId : b.blockerId;
      blockedUserIds.add(other);
    });
  }

  return (
    <div className="grid gap-6">
      <header className="rounded-3xl border bg-white p-6">
        <h1 className="text-2xl font-semibold">受信箱</h1>
        <p className="mt-2 text-sm text-zinc-600">投稿ごとの会話一覧です（最新50件）。</p>
      </header>

      <section className="overflow-hidden rounded-3xl border bg-white">
        {threads.length === 0 ? (
          <div className="px-6 py-10 text-sm text-zinc-600">
            まだ会話がありません。投稿ページから「連絡する」を押すと作成されます。
          </div>
        ) : (
          <ul className="divide-y">
            {threads.map((t) => {
              const other = t.participants
                .map((p) => p.user)
                .find((u) => u.id !== userId);
              const last = t.messages[0];
              const lastReadAt = readMap.get(t.id) ?? new Date(0);
              const isUnread = !!(
                last &&
                last.senderId !== userId &&
                new Date(last.createdAt).getTime() > new Date(lastReadAt).getTime()
              );

              return (
                <li key={t.id} className="px-6 py-4">
                  <Link className="block" href={`/inbox/${t.id}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <div className={"truncate font-medium " + (isUnread ? "text-zinc-900" : "text-zinc-800")}>
                            {other?.displayName ?? "（相手）"}
                          </div>
                          {blockedUserIds.has(other?.id ?? "") ? (
                            <span className="rounded-full border bg-zinc-50 px-2 py-0.5 text-[10px] text-zinc-600">
                              ブロック
                            </span>
                          ) : null}
                          {isUnread ? (
                            <span className="inline-flex h-2 w-2 rounded-full bg-red-600" />
                          ) : null}
                        </div>
                        <div className="mt-1 truncate text-sm text-zinc-600">
                          投稿：{t.post.title}
                        </div>
                        <div className={"mt-2 truncate text-sm " + (isUnread ? "text-zinc-900" : "text-zinc-500")}>
                          {last ? last.body : "（まだメッセージがありません）"}
                        </div>
                      </div>
                      <div className="shrink-0 text-xs text-zinc-500">
                        {last
                          ? new Date(last.createdAt).toLocaleString("ja-JP")
                          : new Date(t.updatedAt).toLocaleString("ja-JP")}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
