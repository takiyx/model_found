import { LpLayout, Faq, RelatedLpLinks } from "../_shared";
import { JsonLd, baseStructuredData, faqStructuredData, absoluteUrl } from "../_jsonld";

export const metadata = {
  title: "モデル掲示板｜Model Find",
  description:
    "モデル募集・撮影者募集を探せるモデル掲示板。地域・期間・報酬・画像ありで絞り込み、最新の募集を見つけられます。",
  alternates: { canonical: "/lp/model-keijiban" },
};

export default function Page() {
  const url = absoluteUrl("/lp/model-keijiban");
  return (
    <>
      <JsonLd data={baseStructuredData()} />
      <JsonLd
        data={
          faqStructuredData({
            url,
            items: [
              {
                q: "モデル掲示板として、どんな募集が載りますか？",
                a: "ポートレート、作品撮り、スタジオ、イベントなど、モデルと撮影者の募集を想定しています。",
              },
              {
                q: "安全に利用するには？",
                a: "不自然な条件・高額報酬・外部連絡の急かしなどには注意し、ルールを確認してから連絡を取りましょう。",
              },
              {
                q: "投稿するには何が必要ですか？",
                a: "募集内容（日時/場所/条件/報酬など）を書き、可能なら画像を添付すると伝わりやすいです。",
              },
            ],
          })
        }
      />

    <LpLayout
      kicker="LANDING"
      title="モデル掲示板"
      desc="Model Find は、モデル・カメラマンを見つけるマッチング掲示板。最新の募集を、条件で絞り込んで探せます。"
      canonical="/lp/model-keijiban"
    >
      <div className="grid gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-black">Model Find の特徴</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-700">
          <li>モデル募集 / 撮影者募集を画像中心で閲覧</li>
          <li>都道府県・期間・報酬などのフィルターで探しやすい</li>
          <li>気になる投稿を保存して後で見返せる</li>
        </ul>
      </div>

      <div className="grid gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-black">まずはこの順番</h2>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-zinc-700">
          <li>地域（都道府県）で絞り込む</li>
          <li>期間で最近の投稿に限定する</li>
          <li>必要なら「報酬あり」「画像あり」を追加する</li>
        </ol>
      </div>

      <div className="grid gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-black">良い募集の書き方（テンプレ）</h2>
        <p className="text-sm text-zinc-700">最低限、次の5点を書くだけでマッチ率が上がります。</p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-700">
          <li>目的：ポートレート/作品撮り/宣材/イベントなど</li>
          <li>日時：候補日と所要時間</li>
          <li>場所：最寄り駅・屋内/屋外・集合/解散</li>
          <li>条件：衣装、メイク、露出の有無（NGも明記）</li>
          <li>報酬：交通費、謝礼、無償の場合はその旨</li>
        </ul>
      </div>

      <Faq
        items={[
          {
            q: "モデル掲示板として、どんな募集が載りますか？",
            a: "ポートレート、作品撮り、スタジオ、イベントなど、モデルと撮影者の募集を想定しています。",
          },
          {
            q: "安全に利用するには？",
            a: "不自然な条件・高額報酬・外部連絡の急かしなどには注意し、ルールを確認してから連絡を取りましょう。",
          },
          {
            q: "投稿するには何が必要ですか？",
            a: "募集内容（日時/場所/条件/報酬など）を書き、可能なら画像を添付すると伝わりやすいです。",
          },
        ]}
      />

      <RelatedLpLinks
        items={[
          { href: "/lp/portrait-model", label: "ポートレートモデル募集" },
          { href: "/lp/satsuei-boshu", label: "撮影募集" },
          { href: "/lp/nude-model-keijiban", label: "ヌードモデル掲示板" },
        ]}
      />
    </LpLayout>
    </>
  );
}
