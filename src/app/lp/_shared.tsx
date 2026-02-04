import Link from "next/link";

export function LpLayout({
  kicker,
  title,
  desc,
  children,
}: {
  kicker: string;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-10">
      <header className="grid gap-4">
        <div className="text-xs font-semibold tracking-[0.18em] text-zinc-500">{kicker}</div>
        <h1 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">{title}</h1>
        <p className="max-w-2xl text-sm text-zinc-700">{desc}</p>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/"
            className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-black/80 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50"
          >
            投稿を見る
          </Link>
          <Link
            href="/posts/new"
            className="rounded-2xl border border-zinc-200 bg-[color:var(--accent-strong)] px-4 py-2 text-sm font-semibold text-black shadow-sm transition hover:brightness-105"
          >
            募集を投稿する
          </Link>
          <Link
            href="/rules"
            className="rounded-2xl border border-zinc-200 bg-zinc-100 px-4 py-2 text-sm font-semibold text-black/80 transition hover:bg-zinc-200"
          >
            ルール
          </Link>
        </div>
      </header>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="grid gap-6">{children}</div>
      </section>
    </div>
  );
}

export function Faq({ items }: { items: Array<{ q: string; a: React.ReactNode }> }) {
  return (
    <div className="grid gap-3">
      <h2 className="text-lg font-semibold tracking-tight text-black">よくある質問</h2>
      <div className="grid gap-2">
        {items.map((it) => (
          <details key={it.q} className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
            <summary className="cursor-pointer list-none font-semibold text-black/90">{it.q}</summary>
            <div className="mt-2 text-sm leading-relaxed text-zinc-700">{it.a}</div>
          </details>
        ))}
      </div>
    </div>
  );
}
