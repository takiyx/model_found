"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Prefecture } from "@prisma/client";
import { PrefectureSelect } from "@/components/prefecture-select";

type PostMode = "PHOTOGRAPHER" | "MODEL";

export function NewPostForm() {
  const router = useRouter();
  const [prefecture, setPrefecture] = useState<Prefecture>(Prefecture.TOKYO);
  const [mode, setMode] = useState<PostMode>("PHOTOGRAPHER");
  const [title, setTitle] = useState("");
  const [reward, setReward] = useState("");
  const [place, setPlace] = useState("");
  const [dateText, setDateText] = useState("");
  const [tags, setTags] = useState("");
  const [contactText, setContactText] = useState("");
  const [body, setBody] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="rounded-3xl border bg-white p-6"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const form = new FormData();
        form.set("prefecture", prefecture);
        form.set("mode", mode);
        form.set("title", title);
        form.set("reward", reward);
        form.set("place", place);
        form.set("dateText", dateText);
        form.set("tags", tags);
        form.set("contactText", contactText);
        form.set("body", body);
        if (images) {
          Array.from(images)
            .slice(0, 6)
            .forEach((f) => form.append("images", f));
        }

        const res = await fetch("/api/posts", {
          method: "POST",
          body: form,
        });

        const data = await res.json().catch(() => null);
        setLoading(false);

        if (!res.ok) {
          if (data?.error === "invalid_input") {
            setError("必須項目を確認してください（地区/本文/連絡先）");
          } else {
            setError("投稿に失敗しました");
          }
          return;
        }

        router.push(`/posts/${data.post.id}`);
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-sm">
          <span className="text-zinc-700">地区（都道府県）*</span>
          <PrefectureSelect
            required
            className="rounded-xl border px-3 py-2"
            value={prefecture}
            onChange={setPrefecture}
          />
        </label>

        <label className="grid gap-1 text-sm">
          <span className="text-zinc-700">投稿者タイプ</span>
          <select
            className="rounded-xl border px-3 py-2"
            value={mode}
            onChange={(e) => setMode(e.target.value as PostMode)}
          >
            <option value="PHOTOGRAPHER">撮影者として投稿</option>
            <option value="MODEL">モデルとして投稿</option>
          </select>
        </label>
      </div>

      <label className="mt-4 grid gap-1 text-sm">
        <span className="text-zinc-700">タイトル</span>
        <input
          className="rounded-xl border px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="例：都内でポートレート撮影できる方募集"
          required
        />
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-sm">
          <span className="text-zinc-700">報酬</span>
          <input
            className="rounded-xl border px-3 py-2"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
            placeholder="例：交通費+¥5,000 / 相互無償"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-zinc-700">場所</span>
          <input
            className="rounded-xl border px-3 py-2"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="例：渋谷 / 新宿"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-zinc-700">日時</span>
          <input
            className="rounded-xl border px-3 py-2"
            value={dateText}
            onChange={(e) => setDateText(e.target.value)}
            placeholder="例：2/10 14:00〜 / 平日夜"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-zinc-700">タグ（カンマ区切り）</span>
          <input
            className="rounded-xl border px-3 py-2"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="例：ポートレート, ストリート, スタジオ"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-1 text-sm">
        <span className="text-zinc-700">写真（最大6枚 / 1枚8MBまで）</span>
        <div className="flex flex-wrap items-center gap-2">
          <input
            id="post-images"
            className="hidden"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            onChange={(e) => setImages(e.target.files)}
          />
          <label
            htmlFor="post-images"
            className="inline-flex cursor-pointer items-center rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-black/80 shadow-sm hover:bg-zinc-50"
          >
            写真を選択
          </label>
          <div className="text-xs text-zinc-500">
            {images && images.length ? `${images.length}枚選択中` : "未選択"}
          </div>
        </div>
      </div>

      <label className="mt-4 grid gap-1 text-sm">
        <span className="text-zinc-700">連絡先（必須）*</span>
        <input
          className="rounded-xl border px-3 py-2"
          value={contactText}
          onChange={(e) => setContactText(e.target.value)}
          placeholder="例：email@example.com / Instagram @xxx / X @xxx"
          required
        />
        <div className="text-xs text-zinc-500">
          迷惑行為対策のため、相手が返信するまで他ユーザーには表示されません。
          <span className="block">※外部URL（http/https/www など）を含む投稿は、自動審査のため一時的に非公開になる場合があります。</span>
        </div>
      </label>

      <label className="mt-4 grid gap-1 text-sm">
        <span className="text-zinc-700">本文（必須）*</span>
        <textarea
          className="min-h-48 rounded-xl border px-3 py-2"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={`・自己紹介\n・希望内容\n・条件\n・連絡方法（站内メッセージ推奨）`}
          required
        />
        <div className="text-xs text-zinc-500">
          ※スパム対策のため、本文に外部URL（http/https/www など）を含む投稿は自動的に非公開になり、管理者確認後に公開されます。
          悪質な投稿は利用制限（BAN）の対象になります。
        </div>
      </label>

      {error ? <div className="mt-4 text-sm text-red-600">{error}</div> : null}

      <div className="mt-4 text-xs text-zinc-500">
        * 必須：地区（都道府県）／本文／連絡先
      </div>

      <button
        disabled={loading}
        className="mt-6 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
      >
        {loading ? "投稿中…" : "投稿する"}
      </button>
    </form>
  );
}
