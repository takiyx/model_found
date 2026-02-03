"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptAdult, setAcceptAdult] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="mx-auto max-w-md rounded-3xl border bg-white p-6">
      <h1 className="text-xl font-semibold">新規登録</h1>
      <p className="mt-1 text-sm text-zinc-600">まずは最小項目だけでOK。</p>

      <form
        className="mt-6 grid gap-3"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setError(null);

          const res = await fetch("/api/signup", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ displayName, email, password, acceptAdult }),
          });

          if (!res.ok) {
            setLoading(false);
            if (res.status === 409) {
              setError("このメールアドレスは既に登録されています");
            } else {
              const data = await res.json().catch(() => null);
              if (data?.error === "accept_required") {
                setError("免責事項に同意し、18歳以上であることを確認してください");
              } else {
                setError("登録に失敗しました");
              }
            }
            return;
          }

          // Auto sign-in
          const signInRes = await signIn("credentials", {
            email,
            password,
            redirect: false,
          });

          setLoading(false);
          if (signInRes?.error) {
            router.push("/login");
            return;
          }
          // Ensure Server Components (e.g. header) re-render with the new session.
          router.replace("/");
          router.refresh();
        }}
      >
        <label className="grid gap-1 text-sm">
          <span className="text-zinc-700">表示名</span>
          <input
            className="rounded-xl border px-3 py-2"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-zinc-700">メール</span>
          <input
            className="rounded-xl border px-3 py-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-zinc-700">パスワード（6文字以上）</span>
          <input
            className="rounded-xl border px-3 py-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </label>

        <div className="mt-2 rounded-2xl border bg-zinc-50 p-4 text-sm text-zinc-700">
          <div className="font-medium text-zinc-900">免責事項・年齢確認（必須）</div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-zinc-600">
            <li>当サイトには成人向け（性的表現を含む）の募集・表現が含まれる可能性があります。</li>
            <li>あなたは18歳以上であることを確認し、自己責任で利用します。</li>
            <li>違法行為・未成年に関する内容・同意のない撮影・強要・搾取等を禁止します。</li>
          </ul>
          <label className="mt-3 flex items-start gap-2 text-xs text-zinc-700">
            <input
              type="checkbox"
              checked={acceptAdult}
              onChange={(e) => setAcceptAdult(e.target.checked)}
              className="mt-0.5"
              required
            />
            <span>
              上記に同意し、<span className="font-medium text-zinc-900">18歳以上</span>であることを確認しました
            </span>
          </label>
        </div>

        {error ? <div className="text-sm text-red-600">{error}</div> : null}

        <button
          disabled={loading}
          className="mt-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {loading ? "作成中…" : "アカウント作成"}
        </button>
      </form>
    </div>
  );
}
