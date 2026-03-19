import { LpLayout, Faq, RelatedLpLinks } from "../_shared";
import { JsonLd, baseStructuredData, faqStructuredData, absoluteUrl } from "../_jsonld";
import { prisma } from "@/lib/db";
import { PostCard } from "@/components/post-card";
import Link from "next/link";

export const metadata = {
  title: "ヌードモデル掲示板｜Model Find",
  description:
    "ヌードモデル掲示板（成人向け募集を含む可能性）として、条件を確認しながら募集を探せます。18歳未満は利用不可。",
  alternates: { canonical: "/lp/nude-model-keijiban" },
};

export default async function Page() {
  const url = absoluteUrl("/lp/nude-model-keijiban");

  // SEED OR: Fetch dynamic posts that make this page ALIVE to Googlebot
  const posts = await prisma.post.findMany({
    where: {
      isPublic: true,
      OR: [
        { tags: { contains: "ヌード" } },
        { tags: { contains: "グラビア" } },
        { tags: { contains: "アダルト" } },
        { tags: { contains: "ランジェリー" } }
      ]
    },
    select: {
      id: true,
      title: true,
      mode: true,
      prefecture: true,
      createdAt: true,
      reward: true,
      place: true,
      dateText: true,
      tags: true,
      author: { select: { displayName: true } },
      images: { orderBy: { createdAt: "asc" }, take: 1, select: { url: true, alt: true, id: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 9,
  });

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
      canonical="/lp/nude-model-keijiban"
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

      <div className="grid gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-black">最低限の安全ルール</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-700">
          <li>初回は事前面談（人目のある場所）→ 合意後に撮影</li>
          <li>外部連絡へ誘導されても、条件が固まるまでは慎重に</li>
          <li>公開範囲・データ扱い（掲載先/期間/削除）を文章で残す</li>
        </ul>
      </div>

      <div className="mt-8 grid gap-4">
        <h2 className="text-xl font-bold tracking-tight text-black border-b pb-2">新着の募集（関連）</h2>
        {posts.length === 0 ? (
          <div className="rounded-xl bg-zinc-50 p-6 text-sm text-zinc-500">
            現在、関連する募集は投稿されていません。
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {posts.map((p: any) => (
                <PostCard key={p.id} post={p as any} favorited={false} />
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/t/%E3%83%8C%E3%83%BC%E3%83%89" className="inline-block rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition">
                もっと掲示板の募集を見る
              </Link>
            </div>
          </>
        )}
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

      <RelatedLpLinks
        items={[
          { href: "/lp/nude-model-boshu", label: "ヌードモデル募集" },
          { href: "/lp/model-keijiban", label: "モデル掲示板" },
          { href: "/rules", label: "安全ガイド" },
        ]}
      />
    </LpLayout>
    </>
  );
}
