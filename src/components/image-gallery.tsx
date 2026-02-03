"use client";

import { useEffect, useMemo, useState } from "react";

export type GalleryImage = {
  id: string;
  url: string;
  alt?: string;
};

export function ImageGallery({ images }: { images: GalleryImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const current = useMemo(() => {
    if (openIndex === null) return null;
    return images[openIndex] ?? null;
  }, [images, openIndex]);

  useEffect(() => {
    if (openIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowLeft") {
        setOpenIndex((i) => (i === null ? i : Math.max(0, i - 1)));
      }
      if (e.key === "ArrowRight") {
        setOpenIndex((i) => (i === null ? i : Math.min(images.length - 1, i + 1)));
      }
    };

    document.addEventListener("keydown", onKeyDown);
    // Prevent background scroll when modal is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIndex, images.length]);

  if (!images.length) return null;

  return (
    <div className="grid gap-3">
      {/* Grid thumbnails */}
      <div className="grid gap-3 sm:grid-cols-2">
        {images.map((img, idx) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setOpenIndex(idx)}
            className="group relative overflow-hidden rounded-3xl border bg-zinc-100 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"
          >
            <div className="aspect-[4/3] w-full">
              <img
                src={img.url}
                alt={img.alt || ""}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                loading="lazy"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0 opacity-0 transition group-hover:opacity-100" />
            <div className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-medium text-zinc-800 backdrop-blur">
              クリックして拡大
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {openIndex !== null && current ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpenIndex(null)}
        >
          <div
            className="relative mx-auto w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-black">
              <img
                src={current.url}
                alt={current.alt || ""}
                className="max-h-[80vh] w-full object-contain"
              />
            </div>

            {/* Controls */}
            <button
              type="button"
              className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-zinc-900 hover:bg-white"
              onClick={() => setOpenIndex(null)}
            >
              閉じる
            </button>

            <div className="pointer-events-none absolute inset-x-0 -bottom-10 flex items-center justify-center gap-2 text-xs text-white/80">
              <span>Esc: 閉じる</span>
              <span>←/→: 移動</span>
              <span>
                {openIndex + 1}/{images.length}
              </span>
            </div>

            {openIndex > 0 ? (
              <button
                type="button"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-white"
                onClick={() => setOpenIndex((i) => (i === null ? i : Math.max(0, i - 1)))}
              >
                ←
              </button>
            ) : null}

            {openIndex < images.length - 1 ? (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-white"
                onClick={() => setOpenIndex((i) => (i === null ? i : Math.min(images.length - 1, i + 1)))}
              >
                →
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
