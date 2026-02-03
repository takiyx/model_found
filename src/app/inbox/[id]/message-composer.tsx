"use client";

import { useMemo, useState, useTransition } from "react";

type TemplateKey = "photographer_to_model" | "model_to_photographer";

function postModeLabel(mode?: string) {
  if (mode === "MODEL") return "モデル募集";
  if (mode === "PHOTOGRAPHER") return "撮影者募集";
  return "募集";
}

function templateText(key: TemplateKey, ctx: { postTitle: string; postMode?: string }) {
  const title = ctx.postTitle ? `【投稿】${ctx.postTitle}` : "";
  const kind = `【募集】${postModeLabel(ctx.postMode)}`;

  if (key === "photographer_to_model") {
    return (
      `${title}\n${kind}\n` +
      "はじめまして。投稿を拝見し、ご連絡しました。\n\n" +
      "【自己紹介】\n（名前/活動地域/実績など）\n\n" +
      "【撮影内容】\n・ジャンル：ポートレート / studio / nude（必要なら）\n・イメージ：\n・参考：URL\n\n" +
      "【日時/場所】\n・候補日：\n・場所：\n・所要時間：\n\n" +
      "【報酬/交通費】\n・報酬：\n・交通費：\n\n" +
      "【同意・配慮】（特に成人向けの場合）\n・当日の範囲変更/中止OK（同意はいつでも撤回可）\n・更衣/休憩スペース：\n・データの扱い（SNS掲載/商用/匿名可否）：\n\n" +
      "よろしければ、ご希望条件（NG/OK）を教えてください。"
    );
  }

  // model_to_photographer
  return (
    `${title}\n${kind}\n` +
    "はじめまして。投稿を拝見し、応募させていただきます。\n\n" +
    "【自己紹介】\n（活動地域/雰囲気/実績など）\n\n" +
    "【可能な内容】\n・ポートレート：OK/NG\n・studio：OK/NG\n・nude：OK/NG（半ヌード可否など）\n\n" +
    "【希望条件】\n・日時：\n・場所：\n・所要時間：\n・報酬：\n\n" +
    "【NG/注意点】\n（例：当日変更は要相談、掲載は事前確認必須 など）\n\n" +
    "作例や当日の詳細（人数/更衣スペース/掲載範囲）を教えていただけると助かります。"
  );
}

export function MessageComposer({
  action,
  postTitle,
  postMode,
  isFirst,
  defaultTemplate,
}: {
  action: (formData: FormData) => void | Promise<void>;
  postTitle: string;
  postMode?: string;
  isFirst: boolean;
  defaultTemplate: TemplateKey;
}) {
  const [body, setBody] = useState("");
  const [key, setKey] = useState<TemplateKey>(defaultTemplate);
  const [pending, startTransition] = useTransition();

  const canSend = body.trim().length > 0;

  const quick = useMemo(() => templateText(key, { postTitle, postMode }), [key, postTitle, postMode]);

  // Gentle UX: suggest template for the first message, but do not auto-fill.

  return (
    <div className="mt-6 grid gap-2">
      {isFirst ? (
        <div className="rounded-2xl border bg-zinc-50 p-3 text-sm text-zinc-700">
          初回メッセージはテンプレ推奨です（要点が伝わりやすく、失礼になりにくい）。
          <button
            type="button"
            className="ml-2 rounded-xl bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800"
            onClick={() => setBody((prev) => (prev.trim().length ? prev + "\n\n" + quick : quick))}
          >
            テンプレを入れる
          </button>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs text-zinc-500">テンプレを使うと要点が伝わりやすくなります。</div>
        <div className="flex items-center gap-2">
          <select
            className="rounded-xl border bg-white px-2 py-1 text-xs"
            value={key}
            onChange={(e) => setKey(e.target.value as TemplateKey)}
          >
            <option value="photographer_to_model">撮影者→モデル</option>
            <option value="model_to_photographer">モデル→撮影者</option>
          </select>
          <button
            type="button"
            className="rounded-xl border bg-white px-3 py-1.5 text-xs hover:bg-zinc-50"
            onClick={() => {
              setBody((prev) => (prev.trim().length ? prev + "\n\n" + quick : quick));
            }}
          >
            テンプレ挿入
          </button>
        </div>
      </div>

      <form
        className="flex gap-2"
        action={(formData) => {
          const text = String(formData.get("body") ?? "").trim();
          if (!text) return;
          startTransition(async () => {
            await action(formData);
            setBody("");
          });
        }}
      >
        <textarea
          name="body"
          rows={3}
          className="min-h-12 flex-1 resize-y rounded-xl border px-3 py-2 text-sm"
          placeholder="メッセージを書く…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button
          disabled={pending || !canSend}
          className="h-fit rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {pending ? "送信中…" : "送信"}
        </button>
      </form>
    </div>
  );
}
