import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { NewPostForm } from "@/components/new-post-form";

export default async function NewPostPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login?callbackUrl=/posts/new");
  }

  return (
    <div className="grid gap-6">
      <header className="rounded-3xl border bg-white p-6">
        <h1 className="text-2xl font-semibold">新規投稿</h1>
        <p className="mt-2 text-sm text-zinc-600">募集内容を入力してください。</p>
      </header>
      <NewPostForm />
    </div>
  );
}
