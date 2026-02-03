"use client";

import { useState } from "react";

function Heart({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 21s-7.5-4.6-10-9.4C.2 8.2 2.2 5 5.8 5c2 0 3.6 1.1 4.5 2.4C11.2 6.1 12.8 5 14.8 5c3.6 0 5.6 3.2 3.8 6.6C19.5 16.4 12 21 12 21z" />
    </svg>
  );
}

export function FavoriteButton({
  kind,
  id,
  initialFavorited,
  className,
}: {
  kind: "post" | "user";
  id: string;
  initialFavorited: boolean;
  className?: string;
}) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  const endpoint = kind === "post" ? "/api/favorites/posts" : "/api/favorites/users";
  const payload = kind === "post" ? { postId: id } : { targetUserId: id };

  return (
    <button
      type="button"
      disabled={loading}
      className={
        (className ??
          "inline-flex items-center justify-center rounded-full border bg-white/85 p-2 text-zinc-700 shadow-sm backdrop-blur hover:bg-white") +
        (favorited ? " text-red-600" : "")
      }
      title={favorited ? "保存済み" : "保存"}
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();

        setLoading(true);
        // optimistic
        setFavorited((v) => !v);

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => null);
        setLoading(false);

        if (!res.ok) {
          // rollback
          setFavorited((v) => !v);
          if (data?.error === "unauthorized") {
            alert("保存するにはログインが必要です");
          } else {
            alert("保存に失敗しました");
          }
          return;
        }

        setFavorited(!!data.favorited);
      }}
    >
      <Heart filled={favorited} />
    </button>
  );
}
