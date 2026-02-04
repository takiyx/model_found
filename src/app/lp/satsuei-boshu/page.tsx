import { LpLayout, Faq } from "../_shared";

export const metadata = {
  title: "撮影募集｜Model Find",
  description:
    "撮影募集（モデル募集・撮影者募集）を探せるマッチング掲示板。地域・期間・報酬・画像ありで絞り込み、最新の募集を見つけられます。",
};

export default function Page() {
  return (
    <LpLayout
      kicker="LANDING"
      title="撮影募集"
      desc="Model Find は、モデル・カメラマンを見つけるマッチング掲示板。撮影募集を条件で絞り込んで探せます。"
    >
      <div className="grid gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-black">探せる募集</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-700">
          <li>モデル募集（撮影者がモデルを探す）</li>
          <li>撮影者募集（モデルが撮影者を探す）</li>
          <li>スタジオ/屋外/イベントなどの撮影条件</li>
        </ul>
      </div>

      <div className="grid gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-black">絞り込みのコツ</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-700">
          <li>まず都道府県を選んで移動コストを減らす</li>
          <li>次に期間（7日/30日）で新しい投稿を優先</li>
          <li>最後に報酬/画像で質感を合わせる</li>
        </ul>
      </div>

      <Faq
        items={[
          {
            q: "撮影募集の連絡はどこからできますか？",
            a: "気になる投稿を開き、投稿者情報や連絡導線を確認してください（仕様は今後調整予定）。",
          },
          {
            q: "募集に書くとよい項目は？",
            a: "日時、場所、所要時間、撮影内容、衣装/メイク、報酬、データ納品などを明確にしましょう。",
          },
          {
            q: "トラブルを避けるには？",
            a: "最初のやりとりで条件を文章で残し、個人情報の交換は必要最小限に。怪しい場合は連絡しない判断も大切です。",
          },
        ]}
      />
    </LpLayout>
  );
}
