import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { EditPostForm } from "@/components/edit-post-form";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session?.user) redirect("/login");
  const userId = session.user.id;

  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id }, include: { images: true } });
  if (!post || !post.isPublic) return notFound();
  if (post.authorId !== userId) return notFound();

  return (
    <div className="grid gap-6">
      <header className="rounded-3xl border bg-white p-6">
        <h1 className="text-2xl font-semibold">投稿を編集</h1>
        <p className="mt-2 text-sm text-zinc-600">タイトルや本文を更新できます。</p>
      </header>
      <EditPostForm post={post} />
    </div>
  );
}
