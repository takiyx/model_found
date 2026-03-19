"use client";

import { useState } from "react";
import { ImageGallery } from "./image-gallery";
import { Lock } from "lucide-react";

export function LockedGallery({
  userId,
  images,
  isPrivate,
  isMe,
}: {
  userId: string;
  images: { id: string; url: string; alt: string }[];
  isPrivate: boolean;
  isMe: boolean;
}) {
  const [unlocked, setUnlocked] = useState(!isPrivate || isMe);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (unlocked) {
    return <ImageGallery images={images} />;
  }

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch(`/api/users/${userId}/verify-portfolio`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);
    if (res.ok) {
      setUnlocked(true);
    } else {
      setError("パスワードが違います");
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-zinc-900 min-h-[300px]">
      <div className="opacity-20 blur-2xl pointer-events-none select-none h-full w-full absolute inset-0">
        <ImageGallery images={images} />
      </div>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/40">
        <div className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-2xl max-w-sm w-full text-center border border-white/20">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 mb-4 shadow-inner">
            <Lock className="h-6 w-6 text-rose-600" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 mb-1">シークレット資料</h3>
          <p className="text-xs text-zinc-600 mb-5">このユーザーの写真はパスワードで保護されています</p>
          
          <form onSubmit={handleUnlock} className="flex flex-col gap-3">
            <input
              type="password"
              placeholder="パスワードを入力"
              className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-center text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <div className="text-xs text-rose-600 font-medium">{error}</div>}
            <button
              disabled={loading || !password}
              className="w-full rounded-xl bg-zinc-900 py-2.5 text-sm font-bold text-white shadow hover:bg-zinc-800 disabled:opacity-50 transition"
            >
              {loading ? "認証中…" : "ロックを解除する"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
