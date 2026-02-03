"use client";

import { useState } from "react";

export function AvatarUploader({
  initialUrl,
  onUploaded,
}: {
  initialUrl: string;
  onUploaded: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 overflow-hidden rounded-2xl border bg-zinc-100">
          {initialUrl ? (
            <img src={initialUrl} alt="" className="h-full w-full object-cover" />
          ) : null}
        </div>

        <div className="grid gap-2">
          <div className="text-sm font-medium text-zinc-900">アイコン画像</div>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            disabled={uploading}
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;

              setUploading(true);
              setError(null);
              setDone(false);

              const form = new FormData();
              form.append("avatar", f);

              const res = await fetch("/api/profile/avatar", {
                method: "POST",
                body: form,
              });

              const data = await res.json().catch(() => null);
              setUploading(false);

              if (!res.ok) {
                setError("アップロードに失敗しました");
                return;
              }

              onUploaded(String(data.avatarUrl || ""));
              setDone(true);
              setTimeout(() => setDone(false), 1200);
            }}
          />
          <div className="text-xs text-zinc-500">最大 8MB / jpg, png, webp, gif</div>
        </div>
      </div>

      {error ? <div className="text-sm text-red-600">{error}</div> : null}
      {uploading ? <div className="text-sm text-zinc-600">アップロード中…</div> : null}
      {done ? <div className="text-sm text-zinc-600">保存しました</div> : null}
    </div>
  );
}
