import Link from "next/link";
import { LpLayout, Faq, RelatedLpLinks } from "../_shared";
import { JsonLd, baseStructuredData, faqStructuredData, absoluteUrl } from "../_jsonld";

export const metadata = {
  title: "ヌードモデル募集｜Model Find",
  description:
    "ヌードモデル募集を探すためのマッチング掲示板。18歳未満は利用不可。条件・報酬・撮影内容を確認し、安全に利用しましょう。",
  alternates: { canonical: "/lp/nude-model-boshu" },
};

export default function Page() {
  const url = absoluteUrl("/lp/nude-model-boshu");
  return (
    <>
      <JsonLd data={baseStructuredData()} />
      <JsonLd
        data={
          faqStructuredData({
            url,
            items: [
              {
                q: "ヌードモデル募集で確認すべき項目は？",
                a: "撮影内容（露出範囲）、撮影場所、同意書、データの扱い（公開/非公開/掲載先）、報酬、キャンセル規定などです。",
              },
              {
                q: "安全のためにできることは？",
                a: "事前に条件を文章で合意し、初回は人目のある場所で打ち合わせ、個人情報の共有は最小限にしましょう。",
              },
              {
                q: "違和感がある募集を見つけたら？",
                a: "無理に連絡せず、ルールに沿って運営へ報告する導線を用意予定です。",
              },
            ],
          })
        }
      />

      <LpLayout
      kicker="LANDING"
      title="ヌードモデル募集"
      canonical="/lp/nude-model-boshu"
      desc="Model Find は、モデル・カメラマンを見つけるマッチング掲示板。成人向けの募集が含まれる可能性があるため、ルールと安全事項を必ず確認してください。"
    >
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <div className="font-semibold">重要：年齢制限と安全</div>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>18歳未満の方は利用できません。</li>
          <li>撮影内容・範囲・公開範囲・報酬・同意事項を文章で確認しましょう。</li>
          <li>不安がある場合は連絡しない、または第三者同席/公共の場所での打ち合わせを推奨します。</li>
        </ul>
      </div>

      <div className="grid gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-black">探し方</h2>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-zinc-700">
          <li>都道府県・期間で絞り込む</li>
          <li>報酬や画像の有無で条件を整える</li>
          <li>必要なら本文検索（キーワード検索）で撮影意図を確認する</li>
        </ol>
        <div className="pt-2">
          <Link
            href="/rules"
            className="rounded-2xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-black/80 hover:bg-zinc-50"
          >
            ルールを確認する
          </Link>
        </div>
      </div>

      <div className="grid gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-black">重要：合意しておきたいこと</h2>
        <p className="text-sm text-zinc-700">ヌード/センシティブな撮影は、後から揉めやすい領域です。最初に文章で合意しましょう。</p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-700">
          <li>露出範囲（例：上半身のみ/全裸なし など）</li>
          <li>掲載先（SNS/ポートフォリオ/商用）と期限</li>
          <li>撮影データの保管期間と削除依頼の可否</li>
          <li>当日の同席者・スタジオ入退室のルール</li>
        </ul>
      </div>

      <Faq
        items={[
          {
            q: "ヌードモデル募集で確認すべき項目は？",
            a: "撮影内容（露出範囲）、撮影場所、同意書、データの扱い（公開/非公開/掲載先）、報酬、キャンセル規定などです。",
          },
          {
            q: "安全のためにできることは？",
            a: "事前に条件を文章で合意し、初回は人目のある場所で打ち合わせ、個人情報の共有は最小限にしましょう。",
          },
          {
            q: "違和感がある募集を見つけたら？",
            a: "投稿詳細から報告できます。安全のため、無理に連絡しない判断も大切です。",
          },
        ]}
      />

      <RelatedLpLinks
        items={[
          { href: "/lp/nude-model-keijiban", label: "ヌードモデル掲示板" },
          { href: "/lp/satsuei-boshu", label: "撮影募集" },
          { href: "/rules", label: "安全ガイド" },
        ]}
      />
    </LpLayout>
    </>
  );
}
