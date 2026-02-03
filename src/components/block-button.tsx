"use client";

import { useState, useTransition } from "react";

export function BlockButton({ blockedId, initialBlocked = false }: { blockedId: string; initialBlocked?: boolean }) {
  const [blocked, setBlocked] = useState(initialBlocked);
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      className={
        "rounded-full border px-3 py-1.5 text-sm hover:bg-zinc-50 " +
        (blocked ? "border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800" : "text-zinc-700")
      }
      onClick={() => {
        const next = !blocked;
        const ok = next ? confirm("このユーザーをブロックしますか？\nブロックするとメッセージの送受信ができなくなります。") : true;
        if (!ok) return;

        setBlocked(next);
        startTransition(async () => {
          try {
            const res = await fetch("/api/blocks/users", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ blockedId }),
            });
            if (!res.ok) {
              setBlocked(!next);
              if (res.status === 401) alert("ログインしてください");
              else alert("失敗しました");
              return;
            }
            const data = await res.json();
            setBlocked(!!data.blocked);
          } catch {
            setBlocked(!next);
            alert("失敗しました");
          }
        });
      }}
    >
      {blocked ? "ブロック中" : "ブロック"}
    </button>
  );
}
