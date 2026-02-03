"use client";

import { useEffect, useState } from "react";

const KEY = "mh_adult_ack_v1";

export function AdultDisclaimerBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY);
      if (!v) setOpen(true);
    } catch {
      // ignore
    }
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] p-3 sm:p-4">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border bg-white/95 p-4 shadow-lg backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-zinc-900">年齢確認・免責事項</div>
            <p className="mt-1 text-xs text-zinc-600">
              当サイトには成人向け（性的表現を含む）の募集・表現が含まれる可能性があります。
              あなたは18歳以上であることを確認し、自己責任で利用してください。
            </p>
            <p className="mt-2 text-[11px] text-zinc-500">
              違法行為・未成年に関する内容・同意のない撮影・強要・搾取等を禁止します。
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              className="rounded-full border px-3 py-1.5 text-sm hover:bg-zinc-50"
              onClick={() => {
                setOpen(false);
              }}
            >
              閉じる
            </button>
            <button
              className="rounded-full bg-zinc-900 px-3 py-1.5 text-sm text-white hover:bg-zinc-800"
              onClick={() => {
                try {
                  localStorage.setItem(KEY, new Date().toISOString());
                } catch {
                  // ignore
                }
                setOpen(false);
              }}
            >
              18歳以上です
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
