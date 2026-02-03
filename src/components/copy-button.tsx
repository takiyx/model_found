"use client";

import { useState } from "react";

export function CopyButton({
  text,
  label = "コピー",
}: {
  text: string;
  label?: string;
}) {
  const [done, setDone] = useState(false);

  return (
    <button
      type="button"
      className="rounded-full border bg-white px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1200);
        } catch {
          alert("コピーできませんでした");
        }
      }}
    >
      {done ? "コピーしました" : label}
    </button>
  );
}
