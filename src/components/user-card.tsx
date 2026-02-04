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
    <div className="group relative block w-64 shrink-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md">
      <div className="absolute right-3 top-3 z-10">
        <FavoriteButton kind="user" id={user.id} initialFavorited={favorited} />
      </div>

      <Link href={`/u/${user.id}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
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
                  className="rounded-2xl border border-zinc-200 bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-black/80"
                >
                  {c}
                </span>
              ))}
              {user.prefecture ? (
                <span className="rounded-2xl border border-zinc-200 bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-black/80">
                  {prefectureLabels[user.prefecture]}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="truncate text-base font-semibold tracking-tight text-black">
            {user.displayName}
          </div>
          <div className="mt-2 text-xs text-zinc-600">{user.basePlace ? user.basePlace : ""}</div>
          {interests.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1">
              {interests.map((t) => (
                <span
                  key={t}
                  className="rounded-2xl border border-zinc-200 bg-white px-2 py-0.5 text-[11px] text-black/80"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : (
            <div className="mt-3 text-xs text-zinc-500">プロフィール未設定</div>
          )}
        </div>
      </Link>
    </div>
  );
}
