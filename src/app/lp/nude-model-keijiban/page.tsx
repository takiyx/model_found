import { LpLayout, Faq } from "../_shared";
import { JsonLd, baseStructuredData, faqStructuredData, absoluteUrl } from "../_jsonld";

export const metadata = {
  title: "ヌードモデル掲示板｜Model Find",
  description:
    "ヌードモデル掲示板（成人向け募集を含む可能性）として、条件を確認しながら募集を探せます。18歳未満は利用不可。",
};

export default function Page() {
  const url = absoluteUrl("/lp/nude-model-keijiban");
  return (
    <>
      <JsonLd data={baseStructuredData()} />
      <JsonLd
        data={
          faqStructuredData({
            url,
            items: [
              {
                q: "ヌードモデル掲示板は誰でも閲覧できますか？",
                a: "当サイトには成人向けの表現が含まれる可能性があります。18歳未満の方は利用できません。",
              },
              {
                q: "どんな条件が危険ですか？",
                a: "高額報酬の即日案件、詳細が曖昧、外部連絡を急かす、同意書なし、公開範囲の説明がない等は慎重に。",
              },
              {
                q: "トラブル防止のために必要なことは？",
                a: "条件の文章化、同意書、データの扱い、公開範囲、身分確認の方法などを事前に合意しましょう。",
              },
            ],
          })
        }
      />

      <LpLayout
      kicker="LANDING"
      title="ヌードモデル掲示板"
      desc="Model Find は、モデル・カメラマンを見つけるマッチング掲示板。成人向けの募集が含まれる可能性があるため、ルールと安全事項を必ず確認してください。"
    >
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <div className="font-semibold">重要：18歳未満は利用できません</div>
        <p className="mt-2">条件や公開範囲を事前に確認し、同意のない撮影・公開につながる募集には近づかないでください。</p>
      </div>

      <div className="grid gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-black">掲示板としての使い方</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-700">
          <li>地域（都道府県）と期間でまず絞り込む</li>
          <li>報酬、画像、本文の記載から条件の具体性を確認する</li>
          <li>不安がある場合はやり取りを中断する</li>
        </ul>
      </div>

      <Faq
        items={[
          {
            q: "ヌードモデル掲示板は誰でも閲覧できますか？",
            a: "当サイトには成人向けの表現が含まれる可能性があります。18歳未満の方は利用できません。",
          },
          {
            q: "どんな条件が危険ですか？",
            a: "高額報酬の即日案件、詳細が曖昧、外部連絡を急かす、同意書なし、公開範囲の説明がない等は慎重に。",
          },
          {
            q: "トラブル防止のために必要なことは？",
            a: "条件の文章化、同意書、データの扱い、公開範囲、身分確認の方法などを事前に合意しましょう。",
          },
        ]}
      />
    </LpLayout>
    </>
  );
}
