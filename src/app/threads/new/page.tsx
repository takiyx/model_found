import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { findOrCreateThreadForPost } from "@/lib/threads";

export default async function ThreadNewPage({
  searchParams,
}: {
  searchParams: Promise<{ postId?: string }>;
}) {
  const session = await getSession();
  if (!session?.user) redirect("/login?callbackUrl=/inbox");

  const sp = await searchParams;
  const postId = sp.postId;
  if (!postId) redirect("/");

  const thread = await findOrCreateThreadForPost({
    postId,
    userId: session.user.id,
  });

  if (!thread) redirect("/posts/" + postId);

  redirect("/inbox/" + thread.id);
}
