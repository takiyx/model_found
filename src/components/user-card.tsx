import Link from "next/link";
import { Prefecture } from "@prisma/client";
import { prefectureLabels } from "@/lib/prefectures";
import { FavoriteButton } from "@/components/favorite-button";

export type UserCardData = {
  id: string;
  displayName: string;
  avatarUrl: string;
  prefecture: Prefecture | null;
  basePlace: string;
  interests: string;
  isPhotographer: boolean;
  isModel: boolean;
};

function chips(u: UserCardData) {
  const out: string[] = [];
  if (u.isPhotographer) out.push("撮影者");
  if (u.isModel) out.push("モデル");
  return out;
}

function interestList(raw: string) {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 3);
}

export function UserCard({
  user,
  favorited = false,
}: {
  user: UserCardData;
  favorited?: boolean;
}) {
  const roleChips = chips(user);
  const interests = interestList(user.interests);

  return (
    <div className="group relative block w-64 shrink-0 overflow-hidden rounded-3xl border border-zinc-200/70 bg-white/80 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800/70 dark:bg-zinc-950/40">
      <div className="absolute right-3 top-3 z-10">
        <FavoriteButton kind="user" id={user.id} initialFavorited={favorited} />
      </div>

      <Link href={`/u/${user.id}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt=""
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-50 via-zinc-100 to-zinc-200" />
          )}

          <div className="absolute inset-x-0 bottom-0 p-4">
            <div className="flex flex-wrap gap-1">
              {roleChips.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-medium text-zinc-700 backdrop-blur dark:bg-zinc-950/60 dark:text-zinc-200"
                >
                  {c}
                </span>
              ))}
              {user.prefecture ? (
                <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-medium text-zinc-700 backdrop-blur dark:bg-zinc-950/60 dark:text-zinc-200">
                  {prefectureLabels[user.prefecture]}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="truncate text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            {user.displayName}
          </div>
          <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-300">{user.basePlace ? user.basePlace : ""}</div>
          {interests.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1">
              {interests.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-zinc-200/70 bg-white/70 px-2 py-0.5 text-[11px] text-zinc-700 backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-950/40 dark:text-zinc-200"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : (
            <div className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">プロフィール未設定</div>
          )}
        </div>
      </Link>
    </div>
  );
}
