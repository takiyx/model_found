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

      <div className="grid gap-8 mt-8">
        <section>
          <h2 className="text-xl font-bold tracking-tight text-black border-b pb-2">ヌードモデル・グラビア掲示板とは？</h2>
          <div className="mt-4 text-sm text-zinc-700 space-y-3 leading-relaxed">
            <p>
              「ヌードモデル（被写体）掲示板」とは、ポートレートやアート作品、グラビア撮影を目的としたモデルとカメラマンをつなぐマッチングプラットフォームです。
              表現の自由度が高く、芸術的な作品づくりを目指すクリエイターが多く利用しています。
            </p>
            <p>
              しかし、露出度の高い撮影である以上、通常のポートレート撮影よりも<strong>「条件のすり合わせ」「プライバシーの保護」「トラブル防止」</strong>に細心の注意を払う必要があります。
              本サイトでは、双方が安心して撮影に臨めるよう、最低限のルールと知識を共有しています。
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold tracking-tight text-black border-b pb-2">ヌード・グラビア撮影の相場と報酬体系</h2>
          <div className="mt-4 text-sm text-zinc-700 space-y-3 leading-relaxed">
            <p>
              募集には大きく分けて「有償依頼」と「相互無償（TFP）」の2種類が存在します。
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>有償依頼（相場）：</strong> 露出度（水着・ランジェリー・セミヌード・完全ヌード）や拘束時間によって大きく変動します。一般的に、個人間の直接取引では時給5,000円〜20,000円以上など幅広いです。交通費やスタジオ代の負担者も必ず事前に確認しましょう。</li>
              <li><strong>相互無償（TFP）：</strong> モデルはデータを無料で貰える、カメラマンは作品撮りができるというメリットの交換です。金銭のやり取りがないため「対等な立場」ですが、スタジオ代の割り勘ルールなどで揉めないよう事前の合意が必須です。</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold tracking-tight text-black border-b pb-2">撮影前の絶対ルール：身バレ防止と「同意書」の必須化</h2>
          <div className="mt-4 text-sm text-zinc-700 space-y-3 leading-relaxed">
            <p>
              ヌードやグラビアの撮影において、最も多いトラブルが<strong>「データの無断公開」「意図しない場所への流出」</strong>です。後悔しないために以下の対策を徹底してください。
            </p>
            <ol className="list-decimal pl-5 space-y-2 mt-2">
              <li><strong>同意書（契約書）を交わす：</strong> 撮影前に、写真の利用目的（SNS掲載のみか、写真集での販売か）、掲載期間、顔出しの有無、データ削除の条件を明記した簡単な同意書にサインを交わしましょう。</li>
              <li><strong>身分証明書の確認：</strong> お互いに本名と身分証明書（免許証など）を確認し合うことで、「匿名だから逃げられる」というリスクを圧倒的に減らすことができます。</li>
              <li><strong>「顔出しNG」の徹底：</strong> 身バレを防ぐ場合、顔を写さない構図に限定するか、公開前に必ずモデル本人がスタンプやモザイク処理を確認するフローを約束しましょう。</li>
            </ol>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold tracking-tight text-black border-b pb-2">危険なカメラマン・地雷案件の5つの特徴</h2>
          <div className="mt-4 text-sm text-zinc-700 space-y-3 leading-relaxed">
            <p>
              以下のような特徴が見られる募集やメッセージには、絶対に応じないよう注意してください。
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>異常な高額報酬：</strong> 「1時間10万円」など相場からかけ離れた甘い言葉で誘うアカウントは、詐欺や別の目的（売春の強要など）の可能性が極めて高いです。</li>
              <li><strong>初回の顔合わせを拒む：</strong> 撮影前にカフェなど「人目のある場所」での事前面談（30分程度）を提案し、それを面倒くさがる・拒絶する相手は危険です。</li>
              <li><strong>密室や車を即座に指定する：</strong> 信頼関係がない状態での密室（ホテルや相手の自宅、車内）での撮影は密室トラブルの元です。</li>
              <li><strong>過去の作例（ポートフォリオ）がない：</strong> SNSのフォロワーがゼロ、または他人の写真を無断転載しているようなアカウントは避けましょう。</li>
              <li><strong>外部のメッセージアプリ（LINE等）へすぐ誘導する：</strong> プラットフォームの監視を逃れるため、すぐにLINEへ移行したがる相手には警戒が必要です。</li>
            </ul>
          </div>
        </section>
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
