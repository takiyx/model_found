"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";
import Image from "next/image";

export function PortfolioUploader({
  initialUrls,
  onUploaded,
}: {
  initialUrls: string[];
  onUploaded: (urls: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="grid gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-zinc-900">ポートフォリオ画像</div>
          <div className="mt-1 text-xs text-zinc-500">最大 9枚 / 8MB（jpg, png, webp, gif）</div>
        </div>
        <div className="grid gap-2">
          <input
            id="portfolio-upload-input"
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            disabled={uploading}
            onChange={async (e) => {
              const files = Array.from(e.target.files ?? []);
              if (files.length === 0) return;

              setUploading(true);
              setError(null);

              const form = new FormData();
              
              const filesToCompress = files.slice(0, 9);
              for (const originalFile of filesToCompress) {
                let f = originalFile;
                try {
                  f = await imageCompression(originalFile, { maxSizeMB: 7.5, maxWidthOrHeight: 4096, useWebWorker: true });
                } catch (err) {}
                form.append("images", f);
              }

              const res = await fetch("/api/profile/portfolio", { method: "POST", body: form });
              const data = await res.json().catch(() => null);
              setUploading(false);

              if (!res.ok) {
                setError("アップロードに失敗しました");
                return;
              }

              onUploaded((data?.portfolioImages ?? []) as string[]);
            }}
          />
          <label
            htmlFor="portfolio-upload-input"
            className="w-fit cursor-pointer rounded-xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-zinc-50"
          >
            画像を選択
          </label>
        </div>
      </div>

      {initialUrls.length ? (
        <div className="grid grid-cols-3 gap-2">
          {initialUrls.slice(0, 9).map((u) => (
            <div key={u} className="relative aspect-square overflow-hidden rounded-xl border bg-zinc-100">
              <Image unoptimized fill src={u} alt="" className="object-cover" />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-zinc-600">まだ画像がありません。</div>
      )}

      {uploading ? <div className="text-sm text-zinc-600">アップロード中…</div> : null}
      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      <button
        type="button"
        className="w-fit rounded-xl border px-3 py-1.5 text-sm hover:bg-zinc-50"
        disabled={uploading}
        onClick={async () => {
          const ok = confirm("ポートフォリオ画像をすべて削除しますか？");
          if (!ok) return;

          setUploading(true);
          setError(null);
          const res = await fetch("/api/profile/portfolio", { method: "DELETE" });
          setUploading(false);
          if (!res.ok) {
            setError("削除に失敗しました");
            return;
          }
          onUploaded([]);
        }}
      >
        画像をクリア
      </button>
    </div>
  );
}
