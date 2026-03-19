"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeletePostButton({ postId }: { postId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("本当にこの投稿を削除しますか？\n削除すると元に戻せません。")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        // Successfully deleted
        router.push("/");
        router.refresh(); // Refresh the router cache to remove the deleted post from lists
      } else {
        alert("削除に失敗しました。");
        setDeleting(false);
      }
    } catch (err) {
      alert("通信エラーが発生しました。");
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-sm text-red-600 hover:bg-red-100 disabled:opacity-50"
    >
      {deleting ? "削除中..." : "削除"}
    </button>
  );
}
