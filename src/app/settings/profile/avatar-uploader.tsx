"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";
import Image from "next/image";

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
        <div className="relative h-16 w-16 overflow-hidden rounded-2xl border bg-zinc-100">
          {initialUrl ? (
            <Image unoptimized fill src={initialUrl} alt="" className="object-cover" />
          ) : null}
        </div>

        <div className="grid gap-2">
          <div className="text-sm font-medium text-zinc-900">アイコン画像</div>
          <input
            id="avatar-upload-input"
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp,image/gif"
            disabled={uploading}
            onChange={async (e) => {
              const originalFile = e.target.files?.[0];
              if (!originalFile) return;

              setUploading(true);
              setError(null);
              setDone(false);

              let f = originalFile;
              try {
                f = await imageCompression(originalFile, { maxSizeMB: 1.0, maxWidthOrHeight: 1080, useWebWorker: true, initialQuality: 0.8 });
              } catch (err) {}

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
          <label
            htmlFor="avatar-upload-input"
            className="w-fit cursor-pointer rounded-xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-zinc-50"
          >
            画像を選択
          </label>
          <div className="text-xs text-zinc-500">最大 8MB / jpg, png, webp, gif</div>
        </div>
      </div>

      {error ? <div className="text-sm text-red-600">{error}</div> : null}
      {uploading ? <div className="text-sm text-zinc-600">アップロード中…</div> : null}
      {done ? <div className="text-sm text-zinc-600">保存しました</div> : null}
    </div>
  );
}
