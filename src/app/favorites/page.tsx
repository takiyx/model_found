import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { PostCard } from "@/components/post-card";
import { UserCard } from "@/components/user-card";

export default async function FavoritesPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login?callbackUrl=/favorites");
  const userId = session.user.id;

  const favUsers = await prisma.favoriteUser.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 30,
    select: {
      targetUser: {
        select: {
          id: true,
          displayName: true,
          avatarUrl: true,
          prefecture: true,
          basePlace: true,
          interests: true,
          isPhotographer: true,
          isModel: true,
        },
      },
    },
  });

  const favPosts = await prisma.favoritePost.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 60,
    select: {
      post: {
        select: {
          id: true,
          title: true,
          mode: true,
          prefecture: true,
          createdAt: true,
          reward: true,
          place: true,
          dateText: true,
          tags: true,
          author: { select: { displayName: true } },
          images: { orderBy: { createdAt: "asc" }, take: 1, select: { url: true, alt: true, id: true } },
        },
      },
    },
  });

  return (
    <div className="grid gap-10">
      <header className="rounded-3xl border bg-white p-6">
        <h1 className="text-2xl font-semibold">保存</h1>
        <p className="mt-2 text-sm text-zinc-600">保存したユーザーと投稿をまとめて見られます。</p>
      </header>

      <section className="grid gap-4">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-semibold">保存したユーザー</h2>
          <div className="text-xs text-zinc-500">{favUsers.length} 件</div>
        </div>

        {favUsers.length === 0 ? (
          <div className="rounded-3xl border bg-white p-10 text-sm text-zinc-600">まだありません。</div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {favUsers.map((x) => (
              <UserCard key={x.targetUser.id} user={x.targetUser as any} favorited />
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-4">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-semibold">保存した投稿</h2>
          <div className="text-xs text-zinc-500">{favPosts.length} 件</div>
        </div>

        {favPosts.length === 0 ? (
          <div className="rounded-3xl border bg-white p-10 text-sm text-zinc-600">まだありません。</div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {favPosts.map((x) => (
              <PostCard key={x.post.id} post={x.post as any} favorited />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
