import Link from "next/link";
import { LpLayout, Faq } from "../_shared";

export const metadata = {
  title: "ポートレートモデル募集｜Model Find",
  description:
    "ポートレート撮影のモデル募集・撮影者募集を探せるマッチング掲示板。地域・期間・報酬・画像ありで絞り込み、安心のルールも確認できます。",
};

export default function Page() {
  return (
    <LpLayout
      kicker="LANDING"
      title="ポートレートモデル募集"
      desc="Model Find は、モデル・カメラマンを見つけるマッチング掲示板。ポートレート撮影の募集を、条件で絞り込んで探せます。"
    >
      <div className="grid gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-black">このページでできること</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-700">
          <li>ポートレート撮影のモデル募集・撮影者募集を一覧で確認</li>
          <li>都道府県・期間・報酬・画像ありで絞り込み</li>
          <li>気になる募集を保存し、連絡につなげる</li>
        </ul>
      </div>

      <div className="grid gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-black">おすすめの探し方</h2>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-zinc-700">
          <li>トップで「都道府県」と「期間」を先に選ぶ</li>
          <li>「報酬：あり」や「画像あり」で募集の質感を揃える</li>
          <li>タグや本文検索（キーワード検索）で撮影イメージを詰める</li>
        </ol>
        <div className="flex flex-wrap gap-2 pt-2">
          <Link
            className="rounded-2xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-black/80 hover:bg-zinc-50"
            href="/tags"
          >
            タグを見る
          </Link>
          <Link
            className="rounded-2xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-black/80 hover:bg-zinc-50"
            href="/rules"
          >
            安全に利用する
          </Link>
        </div>
      </div>

      <Faq
        items={[
          {
            q: "ポートレートモデル募集は無料で利用できますか？",
            a: "閲覧は無料で利用できます（デモ実装のため、仕様は今後変更する可能性があります）。",
          },
          {
            q: "撮影条件の確認で気をつけることは？",
            a: (
              <>
                報酬・所要時間・撮影場所・衣装/メイクの有無・データ納品などを事前に確認しましょう。
                不自然な条件や強引な連絡先要求には注意してください。
              </>
            ),
          },
          {
            q: "タグがない募集も探せますか？",
            a: "本文検索（キーワード検索）や地域/期間の絞り込みで探せます。",
          },
        ]}
      />
    </LpLayout>
  );
}
