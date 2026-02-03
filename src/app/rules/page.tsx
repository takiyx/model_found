import Link from "next/link";

export default function RulesPage() {
  return (
    <div className="grid gap-6">
      <header className="rounded-3xl border bg-white p-6">
        <h1 className="text-2xl font-semibold">安全ガイド / ルール</h1>
        <p className="mt-2 text-sm text-zinc-600">
          安全のため、以下のルールと注意点を守ってご利用ください。
        </p>
      </header>

      <section className="rounded-3xl border bg-white p-6">
        <h2 className="text-lg font-semibold">基本ルール</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-700">
          <li>18歳未満の利用は禁止です（成人向けコンテンツを含みます）。</li>
          <li>迷惑行為・脅迫・執拗な連絡はNG。相手が嫌がる行為はやめてください。</li>
          <li>金銭/投資/副業/詐欺的な勧誘は禁止。</li>
          <li>なりすまし・虚偽の経歴・無断転載は禁止。</li>
          <li>違法行為・児童に関する疑いがある内容は即時対応対象です。</li>
        </ul>
      </section>

      <section className="rounded-3xl border bg-white p-6">
        <h2 className="text-lg font-semibold">安全のコツ</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-700">
          <li>最初は站内メッセージでやりとりし、相手の反応や内容を確認。</li>
          <li>高額報酬/当日手渡し/自撮りのみ等、違和感があれば慎重に。</li>
          <li>個人情報（住所・本名・連絡先）は信頼できる相手に最小限で。</li>
        </ul>
      </section>

      <section className="rounded-3xl border bg-white p-6">
        <h2 className="text-lg font-semibold">困ったとき</h2>
        <p className="mt-2 text-sm text-zinc-700">
          不審な投稿や迷惑行為を見つけたら、各投稿ページの「報告」から運営に連絡できます。
        </p>
        <div className="mt-4">
          <Link className="rounded-full border px-3 py-1.5 text-sm hover:bg-zinc-50" href="/">
            ホームへ
          </Link>
        </div>
      </section>
    </div>
  );
}
