import Link from "next/link";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";
import { countUnreadThreads } from "@/lib/unread";
import { countUnreadNotifications } from "@/lib/notifications";
import { NoticeBanner } from "@/components/notice-banner";

export async function SiteHeader() {
  // Mark this Server Component as dynamic (per-request) so auth state updates immediately.
  cookies();

  const session = await getSession();
  const userId = (session as any)?.user?.id as string | undefined;
  const bannedAt = (session as any)?.user?.bannedAt as Date | undefined;

  const unread = userId ? await countUnreadThreads(userId) : 0;
  const unreadNoti = userId ? await countUnreadNotifications(userId) : 0;

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto grid max-w-6xl gap-2 px-4 py-3 sm:px-6">
        {bannedAt ? (
          <NoticeBanner tone="danger" title="このアカウントは現在制限されています">
            操作できない場合があります。必要ならログアウトして別のアカウントでログインしてください。
          </NoticeBanner>
        ) : null}

        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/" className="whitespace-nowrap font-semibold tracking-tight">
              Model Find
            </Link>
            <nav className="hidden min-w-0 items-center gap-3 overflow-x-auto text-sm text-zinc-600 sm:flex">
              <Link className="whitespace-nowrap hover:text-zinc-900" href="/rules">
                ルール
              </Link>
              <Link className="whitespace-nowrap hover:text-zinc-900" href="/tags">
                タグ
              </Link>
              {/* セキュリティはフッターへ移動 */}
            </nav>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <Link
              className="whitespace-nowrap rounded-2xl border px-3 py-1.5 text-sm hover:bg-zinc-50"
              href="/posts/new"
            >
              新規投稿
            </Link>

            {session?.user ? (
              <>
                <Link
                  className="relative whitespace-nowrap rounded-2xl border px-3 py-1.5 text-sm hover:bg-zinc-50"
                  href="/inbox"
                >
                  受信箱
                  {unread > 0 ? (
                    <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[10px] font-semibold leading-5 text-white">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  ) : null}
                </Link>
                <details className="relative">
                  <summary className="list-none cursor-pointer whitespace-nowrap rounded-2xl border px-3 py-1.5 text-sm hover:bg-zinc-50">
                    <span className="inline-flex items-center gap-2">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
                        {String(((session as any).user?.name ?? (session as any).user?.email ?? "U").trim().charAt(0)).toUpperCase()}
                      </span>
                      <span className="hidden sm:inline">
                        {(session as any).user?.name ?? (session as any).user?.email}
                      </span>
                      {unreadNoti > 0 ? (
                        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[10px] font-semibold leading-5 text-white">
                          {unreadNoti > 9 ? "9+" : unreadNoti}
                        </span>
                      ) : null}
                    </span>
                  </summary>
                  <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border bg-white shadow-lg">
                    <div className="px-3 py-2 text-xs text-zinc-500">
                      {(session as any).user?.name ?? (session as any).user?.email}
                    </div>
                    <div className="h-px bg-zinc-100" />
                    <div className="grid">
                      <Link className="px-3 py-2 text-sm hover:bg-zinc-50" href="/notifications">
                        <span className="flex items-center justify-between">
                          <span>通知</span>
                          {unreadNoti > 0 ? (
                            <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[10px] font-semibold leading-5 text-white">
                              {unreadNoti > 9 ? "9+" : unreadNoti}
                            </span>
                          ) : null}
                        </span>
                      </Link>
                      <Link className="px-3 py-2 text-sm hover:bg-zinc-50" href="/favorites">
                        保存
                      </Link>
                      <Link className="px-3 py-2 text-sm hover:bg-zinc-50" href={`/u/${userId}`}>
                        プロフィール
                      </Link>
                    </div>
                    <div className="h-px bg-zinc-100" />
                    <Link className="px-3 py-2 text-sm hover:bg-zinc-50" href="/logout">
                      ログアウト
                    </Link>
                  </div>
                </details>
              </>
            ) : (
              <>
                <Link
                  className="whitespace-nowrap rounded-2xl border px-3 py-1.5 text-sm hover:bg-zinc-50"
                  href="/login?callbackUrl=/inbox"
                >
                  受信箱
                </Link>
                <Link
                  className="whitespace-nowrap rounded-2xl border px-3 py-1.5 text-sm hover:bg-zinc-50"
                  href="/login"
                >
                  ログイン
                </Link>
                <Link
                  className="whitespace-nowrap rounded-2xl bg-zinc-900 px-3 py-1.5 text-sm text-white hover:bg-zinc-800"
                  href="/signup"
                >
                  新規登録
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
