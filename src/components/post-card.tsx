import Link from "next/link";

import { Prefecture } from "@prisma/client";
import { prefectureLabels } from "@/lib/prefectures";
import { FavoriteButton } from "@/components/favorite-button";
import { TagChip } from "@/components/tag-chip";

export type PostCardData = {
  id: string;
  title: string;
  mode: "PHOTOGRAPHER" | "MODEL";
  prefecture: Prefecture;
  createdAt: Date;
  reward: string;
  place: string;
  dateText: string;
  tags: string;
  author: { displayName: string };
  images: { id?: string; url: string; alt: string }[];
};

function modeLabel(mode: PostCardData["mode"]) {
  return mode === "PHOTOGRAPHER" ? "撮影者" : "モデル";
}

function tagList(tags: string) {
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 5);
}

export function PostCard({
  post,
  favorited = false,
}: {
  post: PostCardData;
  favorited?: boolean;
}) {
  const cover = post.images[0];
  const tags = tagList(post.tags);

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-zinc-200/70 bg-white/80 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800/70 dark:bg-zinc-950/40">
      <div className="absolute right-3 top-3 z-10">
        <FavoriteButton kind="post" id={post.id} initialFavorited={favorited} />
      </div>

      <Link href={`/posts/${post.id}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
          {cover ? (
            <img
              src={cover.url}
              alt={cover.alt || ""}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-50 via-zinc-100 to-zinc-200" />
          )}

          <div className="absolute inset-x-0 bottom-0 p-4">
            <div className="flex flex-wrap gap-1">
              <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-medium text-zinc-700 backdrop-blur dark:bg-zinc-950/60 dark:text-zinc-200">
                {modeLabel(post.mode)}募集
              </span>
              <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-medium text-zinc-700 backdrop-blur dark:bg-zinc-950/60 dark:text-zinc-200">
                {prefectureLabels[post.prefecture]}
              </span>
              {post.reward ? (
                <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-medium text-zinc-700 backdrop-blur dark:bg-zinc-950/60 dark:text-zinc-200">
                  {post.reward}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="line-clamp-2 text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            {post.title}
          </div>

          <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-600 dark:text-zinc-300">
            {post.place ? <span className="truncate">{post.place}</span> : null}
            {post.dateText ? <span className="truncate">{post.dateText}</span> : null}
          </div>

          {tags.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1">
              {tags.map((t) => (
                <TagChip key={t} tag={t} />
              ))}
            </div>
          ) : null}

          <div className="mt-4 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span className="truncate">{post.author.displayName}</span>
            <span className="shrink-0">
              {new Date(post.createdAt).toLocaleDateString("ja-JP")}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
