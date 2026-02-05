import { promises as fs } from "fs";
import path from "path";

export const metadata = {
  title: "更新ログ",
  description: "Model Find の更新履歴",
};

async function readChangelog() {
  const p = path.join(process.cwd(), "src", "content", "changelog.md");
  return await fs.readFile(p, "utf8");
}

export default async function ChangelogPage() {
  const md = await readChangelog();

  return (
    <div className="grid gap-4">
      <div className="grid gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">更新ログ</h1>
        <p className="text-sm text-zinc-600">小さな変更も、できるだけ記録します。</p>
      </div>

      <article className="prose prose-zinc max-w-none prose-headings:scroll-mt-24">
        <pre className="whitespace-pre-wrap rounded-2xl border bg-white p-4 text-sm leading-6">
          {md}
        </pre>
      </article>
    </div>
  );
}
