"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const PREFECTURES: Array<{ value: string; label: string }> = [
  { value: "HOKKAIDO", label: "北海道" },
  { value: "AOMORI", label: "青森県" },
  { value: "IWATE", label: "岩手県" },
  { value: "MIYAGI", label: "宮城県" },
  { value: "AKITA", label: "秋田県" },
  { value: "YAMAGATA", label: "山形県" },
  { value: "FUKUSHIMA", label: "福島県" },
  { value: "IBARAKI", label: "茨城県" },
  { value: "TOCHIGI", label: "栃木県" },
  { value: "GUNMA", label: "群馬県" },
  { value: "SAITAMA", label: "埼玉県" },
  { value: "CHIBA", label: "千葉県" },
  { value: "TOKYO", label: "東京都" },
  { value: "KANAGAWA", label: "神奈川県" },
  { value: "NIIGATA", label: "新潟県" },
  { value: "TOYAMA", label: "富山県" },
  { value: "ISHIKAWA", label: "石川県" },
  { value: "FUKUI", label: "福井県" },
  { value: "YAMANASHI", label: "山梨県" },
  { value: "NAGANO", label: "長野県" },
  { value: "GIFU", label: "岐阜県" },
  { value: "SHIZUOKA", label: "静岡県" },
  { value: "AICHI", label: "愛知県" },
  { value: "MIE", label: "三重県" },
  { value: "SHIGA", label: "滋賀県" },
  { value: "KYOTO", label: "京都府" },
  { value: "OSAKA", label: "大阪府" },
  { value: "HYOGO", label: "兵庫県" },
  { value: "NARA", label: "奈良県" },
  { value: "WAKAYAMA", label: "和歌山県" },
  { value: "TOTTORI", label: "鳥取県" },
  { value: "SHIMANE", label: "島根県" },
  { value: "OKAYAMA", label: "岡山県" },
  { value: "HIROSHIMA", label: "広島県" },
  { value: "YAMAGUCHI", label: "山口県" },
  { value: "TOKUSHIMA", label: "徳島県" },
  { value: "KAGAWA", label: "香川県" },
  { value: "EHIME", label: "愛媛県" },
  { value: "KOCHI", label: "高知県" },
  { value: "FUKUOKA", label: "福岡県" },
  { value: "SAGA", label: "佐賀県" },
  { value: "NAGASAKI", label: "長崎県" },
  { value: "KUMAMOTO", label: "熊本県" },
  { value: "OITA", label: "大分県" },
  { value: "MIYAZAKI", label: "宮崎県" },
  { value: "KAGOSHIMA", label: "鹿児島県" },
  { value: "OKINAWA", label: "沖縄県" },
];

function setParam(params: URLSearchParams, key: string, value: string | null) {
  if (!value) params.delete(key);
  else params.set(key, value);
}

export function DiscoverControls() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialQ = searchParams.get("q") ?? "";
  const initialTag = searchParams.get("tag") ?? "";
  const initialPref = searchParams.get("prefecture") ?? "";
  const initialDays = searchParams.get("days") ?? "";
  const initialHasImage = searchParams.get("hasImage") === "1";
  const initialHasReward = searchParams.get("hasReward") ?? "";
  const initialSort = searchParams.get("sort") ?? "latest";

  const [q, setQ] = useState(initialQ);
  const [prefecture, setPrefecture] = useState(initialPref);
  const [days, setDays] = useState(initialDays);
  const [hasReward, setHasReward] = useState(initialHasReward);
  const [sort, setSort] = useState(initialSort);
  const [hasImage, setHasImage] = useState(initialHasImage);

  const applyUrl = useMemo(() => {
    const p = new URLSearchParams(searchParams.toString());
    // keep mode/region chips; just update our filters
    setParam(p, "q", q.trim() || null);
    setParam(p, "prefecture", prefecture || null);
    setParam(p, "days", days || null);
    setParam(p, "hasReward", hasReward || null);
    setParam(p, "sort", sort || null);
    setParam(p, "hasImage", hasImage ? "1" : null);
    return `${pathname}?${p.toString()}`.replace(/\?$/, "");
  }, [pathname, searchParams, q, prefecture, days, hasReward, sort, hasImage]);

  return (
    <div className="grid gap-3">
      {/* Search box (optional) */}
      <details className="group">
        <summary className="list-none cursor-pointer select-none">
          <div className="inline-flex items-center gap-2 rounded-2xl border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-black/80 shadow-sm hover:bg-zinc-50">
            <span>キーワード検索</span>
            <span className="text-xs text-zinc-500 group-open:hidden">（開く）</span>
            <span className="text-xs text-zinc-500 hidden group-open:inline">（閉じる）</span>
          </div>
        </summary>

        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            router.push(applyUrl);
          }}
        >
          <input
            className="flex-1 rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm text-black shadow-sm outline-none placeholder:text-zinc-500 focus:border-zinc-400"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="検索（タイトル/本文/タグ）"
          />
          <button
            type="submit"
            className="rounded-2xl bg-[color:var(--accent-strong)] px-4 py-2 text-sm font-semibold text-black shadow-sm transition hover:brightness-105"
          >
            検索
          </button>
        </form>
      </details>

      <div className="flex flex-wrap items-center gap-2">
        {initialTag ? (
          <button
            type="button"
            className="rounded-2xl border border-zinc-300 bg-[color:var(--accent)] px-3 py-1.5 text-xs font-semibold text-black shadow-sm transition hover:brightness-105"
            onClick={() => {
              const p = new URLSearchParams(searchParams.toString());
              setParam(p, "tag", null);
              router.push(`${pathname}?${p.toString()}`.replace(/\?$/, ""));
            }}
            title="タグ絞り込みを解除"
          >
            タグ: {initialTag} ×
          </button>
        ) : null}
        <select
          className="rounded-2xl border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-black/80 transition hover:bg-zinc-50"
          value={prefecture}
          onChange={(e) => setPrefecture(e.target.value)}
        >
          <option value="">都道府県：全国</option>
          {PREFECTURES.map((x) => (
            <option key={x.value} value={x.value}>
              {x.label}
            </option>
          ))}
        </select>

        <select
          className="rounded-2xl border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-black/80 transition hover:bg-zinc-50"
          value={days}
          onChange={(e) => setDays(e.target.value)}
        >
          <option value="">期間：すべて</option>
          <option value="7">期間：7日</option>
          <option value="30">期間：30日</option>
        </select>

        <select
          className="rounded-2xl border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-black/80 transition hover:bg-zinc-50"
          value={hasReward}
          onChange={(e) => setHasReward(e.target.value)}
        >
          <option value="">報酬：すべて</option>
          <option value="1">報酬：あり</option>
          <option value="0">報酬：なし</option>
        </select>

        <select
          className="rounded-2xl border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-black/80 transition hover:bg-zinc-50"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="latest">並び順：最新</option>
          <option value="image">並び順：画像優先</option>
        </select>

        <label className="inline-flex items-center gap-2 rounded-2xl border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-black/80 transition hover:bg-zinc-50">
          <input
            type="checkbox"
            checked={hasImage}
            onChange={(e) => setHasImage(e.target.checked)}
          />
          画像あり
        </label>

        <button
          type="button"
          className="ml-auto rounded-2xl bg-[color:var(--accent-strong)] px-4 py-1.5 text-xs font-semibold text-black shadow-sm transition hover:brightness-105"
          onClick={() => router.push(applyUrl)}
        >
          絞り込む
        </button>
      </div>

      {/* Helps dev / debugging */}
      <div className="hidden text-xs text-zinc-500">{applyUrl}</div>
    </div>
  );
}
