"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Prefecture } from "@prisma/client";
import { PrefectureSelect } from "@/components/prefecture-select";

type PostMode = "PHOTOGRAPHER" | "MODEL";

export function EditPostForm({
  post,
}: {
  post: {
    id: string;
    prefecture: Prefecture;
    mode: PostMode;
    title: string;
    reward: string;
    place: string;
    dateText: string;
    tags: string;
    contactText: string;
    body: string;
  };
}) {
  const router = useRouter();

  const [prefecture, setPrefecture] = useState<Prefecture>(post.prefecture);
  const [mode, setMode] = useState<PostMode>(post.mode);
  const [title, setTitle] = useState(post.title);
  const [reward, setReward] = useState(post.reward);
  const [place, setPlace] = useState(post.place);
  const [dateText, setDateText] = useState(post.dateText);
  const [tags, setTags] = useState(post.tags);
  const [contactText, setContactText] = useState(post.contactText);
  const [body, setBody] = useState(post.body);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  return (
    <div className="grid gap-4">
      <form
        className="rounded-3xl border bg-white p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setError(null);

          const res = await fetch(`/api/posts/${post.id}`, {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              prefecture,
              mode,
              title,
              reward,
              place,
              dateText,
              tags,
              contactText,
              body,
            }),
          });

          setLoading(false);
          const data = await res.json().catch(() => null);
          if (!res.ok) {
            if (data?.error === "invalid_input") {
              setError("必須項目を確認してください（地区/本文/連絡先）");
            } else {
              setError("更新に失敗しました");
            }
            return;
          }

          router.push(`/posts/${post.id}`);
          router.refresh();
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

        <label className="mt-4 grid gap-1 text-sm">
          <span className="text-zinc-700">連絡先（必須）*</span>
          <input
            className="rounded-xl border px-3 py-2"
            value={contactText}
            onChange={(e) => setContactText(e.target.value)}
            placeholder="例：email@example.com / Instagram @xxx / X @xxx"
            required
          />
        </label>

        <label className="mt-4 grid gap-1 text-sm">
          <span className="text-zinc-700">本文（必須）*</span>
          <textarea
            className="min-h-48 rounded-xl border px-3 py-2"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </label>

        {error ? <div className="mt-4 text-sm text-red-600">{error}</div> : null}

        <div className="mt-4 text-xs text-zinc-500">
          * 必須：地区（都道府県）／本文／連絡先
        </div>

        <button
          disabled={loading}
          className="mt-6 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {loading ? "更新中…" : "更新する"}
        </button>
      </form>

      <div className="rounded-3xl border bg-white p-6">
        <h2 className="text-lg font-semibold">削除</h2>
        <p className="mt-2 text-sm text-zinc-600">この操作は取り消せません。</p>
        <button
          disabled={deleting}
          className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
          onClick={async () => {
            if (!confirm("本当に削除しますか？")) return;
            setDeleting(true);
            const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
            setDeleting(false);
            if (!res.ok) {
              alert("削除に失敗しました");
              return;
            }
            router.push("/");
            router.refresh();
          }}
        >
          {deleting ? "削除中…" : "削除する"}
        </button>
      </div>
    </div>
  );
}
