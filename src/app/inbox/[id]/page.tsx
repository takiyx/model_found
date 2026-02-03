import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { isBlockedBetween } from "@/lib/blocks";
import { sendThreadMessage } from "@/lib/messages";

import { NoticeBanner } from "@/components/notice-banner";
import { MessageComposer } from "./message-composer";

export default async function ThreadPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  const sp = await searchParams;
  const error = sp.error;
  if (!session?.user) redirect("/login?callbackUrl=/inbox");
  const userId = session.user.id;

  const { id: threadId } = await params;

  const participant = await prisma.threadParticipant.findUnique({
    where: { threadId_userId: { threadId, userId } },
    select: { threadId: true },
  });
  if (!participant) return notFound();

  // Mark as read when opening the thread
  await prisma.threadParticipant.update({
    where: { threadId_userId: { threadId, userId } },
    data: { lastReadAt: new Date() },
  });

  // Mark related message notification as read
  await prisma.notification.updateMany({
    where: { userId, kind: "THREAD_MESSAGE", threadId },
    data: { readAt: new Date() },
  });

  const thread = await prisma.thread.findUnique({
    where: { id: threadId },
    include: {
      post: { select: { id: true, title: true, authorId: true, mode: true } },
      participants: { include: { user: { select: { id: true, displayName: true } } } },
      messages: {
        orderBy: { createdAt: "asc" },
        take: 200,
        include: { sender: { select: { id: true, displayName: true } } },
      },
    },
  });

  if (!thread) return notFound();

  const other = thread.participants
    .map((p) => p.user)
    .find((u) => u.id !== userId);

  const blocked = other?.id ? await isBlockedBetween(userId, other.id) : false;

  return (
    <div className="grid gap-6">
      <header className="rounded-3xl border bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-medium text-zinc-500">会話</div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
              {other?.displayName ?? "（相手）"}
            </h1>
            <div className="mt-2 text-sm text-zinc-600">
              投稿：{" "}
              <Link className="hover:underline" href={`/posts/${thread.post.id}`}>
                {thread.post.title}
              </Link>
            </div>
          </div>
          <Link className="rounded-full border px-3 py-1.5 text-sm hover:bg-zinc-50" href="/inbox">
            一覧へ
          </Link>
        </div>
      </header>

      {error === "rate_limited" ? (
        <NoticeBanner tone="warning" title="送信回数が多すぎます">
          少し時間をおいてから再度お試しください。
        </NoticeBanner>
      ) : error === "blocked" ? (
        <NoticeBanner tone="danger" title="ブロック中のため送信できません" />
      ) : null}

      <section className="rounded-3xl border bg-white p-6">
        <div className="grid gap-3">
          {thread.messages.length === 0 ? (
            <div className="text-sm text-zinc-600">まだメッセージがありません。</div>
          ) : (
            <ul className="grid gap-3">
              {thread.messages.map((m) => {
                const mine = m.senderId === userId;
                return (
                  <li
                    key={m.id}
                    className={
                      "max-w-[80%] rounded-2xl px-4 py-3 text-sm " +
                      (mine
                        ? "ml-auto bg-zinc-900 text-white"
                        : "mr-auto bg-zinc-100 text-zinc-900")
                    }
                  >
                    <div className="whitespace-pre-wrap">{m.body}</div>
                    <div className={"mt-2 text-xs opacity-70 " + (mine ? "text-white" : "text-zinc-600")}>
                      {new Date(m.createdAt).toLocaleString("ja-JP")}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {blocked ? (
          <div className="mt-6 rounded-2xl border bg-zinc-50 p-4 text-sm text-zinc-600">
            ブロック中のため、この会話ではメッセージを送信できません。
          </div>
        ) : (
          <MessageComposer
            postTitle={thread.post.title}
            postMode={thread.post.mode}
            isFirst={thread.messages.length === 0}
            defaultTemplate={(() => {
              const isAuthor = thread.post.authorId === userId;
              const m = thread.post.mode;
              // mode MODEL = looking for model (author is photographer)
              if (m === "MODEL") return isAuthor ? "photographer_to_model" : "model_to_photographer";
              // mode PHOTOGRAPHER = looking for photographer (author is model)
              return isAuthor ? "model_to_photographer" : "photographer_to_model";
            })()}
            action={async (formData) => {
              "use server";
              const body = String(formData.get("body") ?? "").trim();
              if (!body) return;
              const result = await sendThreadMessage({ threadId, senderId: userId, body });
              if (!result.ok) {
                redirect("/inbox/" + threadId + "?error=" + result.error);
              }
              redirect("/inbox/" + threadId);
            }}
          />
        )}
      </section>
    </div>
  );
}
