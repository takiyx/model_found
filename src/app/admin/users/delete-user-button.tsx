"use client";

import { useFormStatus } from "react-dom";

export function DeleteUserButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (
          !window.confirm(
            "本当にこのユーザーとその関連データ（投稿・お気に入り等）を全て削除しますか？\nこの操作は元に戻せません。"
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      {pending ? "削除中..." : "ユーザー削除"}
    </button>
  );
}
