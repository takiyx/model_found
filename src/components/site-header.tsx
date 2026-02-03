import Link from "next/link";
import { getSession } from "@/lib/session";
import { countUnreadThreads } from "@/lib/unread";
import { countUnreadNotifications } from "@/lib/notifications";
import { NoticeBanner } from "@/components/notice-banner";

export async function SiteHeader() {
  const session = await getSession();
  const userId = (session as any)?.user?.id as string | undefined;
  const bannedAt = (session as any)?.user?.bannedAt as Date | undefined;

  const unread = userId ? await countUnreadThreads(userId) : 0;
  const unreadNoti = userId ? await countUnreadNotifications(userId) : 0;

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto grid max-w-5xl gap-2 px-4 py-3 sm:px-6">
        {bannedAt ? (
          <NoticeBanner tone="danger" title="このアカウントは現在制限されています">
            操作できない場合があります。必要ならログアウトして別のアカウントでログインしてください。
          </NoticeBanner>
        ) : null}

        <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-semibold tracking-tight">
            モデルひろば（モダン）
          </Link>
          <nav className="hidden items-center gap-3 text-sm text-zinc-600 sm:flex">
            <Link className="hover:text-zinc-900" href="/pg/east">
              東日本
            </Link>
            <Link className="hover:text-zinc-900" href="/pg/west">
              西日本
            </Link>
            <Link className="hover:text-zinc-900" href="/rules">
              ルール
            </Link>
            <Link className="hover:text-zinc-900" href="/tags">
              タグ
            </Link>
            <Link className="hover:text-zinc-900" href="/admin/picks">
              運営
            </Link>
            <Link className="hover:text-zinc-900" href="/settings/security">
              セキュリティ
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link
            className="rounded-full border px-3 py-1.5 text-sm hover:bg-zinc-50"
            href="/posts/new"
          >
            新規投稿
          </Link>

          {session?.user ? (
            <>
              <Link
                className="relative rounded-full border px-3 py-1.5 text-sm hover:bg-zinc-50"
                href="/inbox"
              >
                受信箱
                {unread > 0 ? (
                  <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[10px] font-semibold leading-5 text-white">
                    {unread > 9 ? "9+" : unread}
                  </span>
                ) : null}
              </Link>
              <Link
                className="relative hidden rounded-full border px-3 py-1.5 text-sm hover:bg-zinc-50 sm:inline-flex"
                href="/notifications"
              >
                通知
                {unreadNoti > 0 ? (
                  <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[10px] font-semibold leading-5 text-white">
                    {unreadNoti > 9 ? "9+" : unreadNoti}
                  </span>
                ) : null}
              </Link>
              <Link
                className="hidden rounded-full border px-3 py-1.5 text-sm hover:bg-zinc-50 sm:inline-flex"
                href="/favorites"
              >
                保存
              </Link>
              <Link
                className="hidden rounded-full border px-3 py-1.5 text-sm hover:bg-zinc-50 sm:inline-flex"
                href={`/u/${userId}`}
              >
                プロフィール
              </Link>
              <span className="hidden text-sm text-zinc-600 sm:inline">
                {(session as any).user?.name ?? (session as any).user?.email}
              </span>
              <Link
                className="rounded-full bg-zinc-900 px-3 py-1.5 text-sm text-white hover:bg-zinc-800"
                href="/logout"
              >
                ログアウト
              </Link>
            </>
          ) : (
            <>
              <Link
                className="rounded-full border px-3 py-1.5 text-sm hover:bg-zinc-50"
                href="/login?callbackUrl=/inbox"
              >
                受信箱
              </Link>
              <Link
                className="rounded-full border px-3 py-1.5 text-sm hover:bg-zinc-50"
                href="/login"
              >
                ログイン
              </Link>
              <Link
                className="rounded-full bg-zinc-900 px-3 py-1.5 text-sm text-white hover:bg-zinc-800"
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
