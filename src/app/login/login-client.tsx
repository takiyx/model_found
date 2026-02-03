"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginClient({ callbackUrl }: { callbackUrl: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="mx-auto max-w-md rounded-3xl border bg-white p-6">
      <h1 className="text-xl font-semibold">ログイン</h1>
      <p className="mt-1 text-sm text-zinc-600">メールアドレスとパスワードでログイン。</p>

      <form
        className="mt-6 grid gap-3"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setError(null);
          const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
          });
          setLoading(false);
          if (res?.error) {
            // MVP: credentials provider returns generic error; treat as invalid or banned.
            setError("ログインできません（メール/パスワード、またはアカウント制限）");
            return;
          }
          // Ensure Server Components (e.g. header) re-render with the new session.
          router.replace(callbackUrl);
          router.refresh();
        }}
      >
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
          <span className="text-zinc-700">パスワード</span>
          <input
            className="rounded-xl border px-3 py-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error ? <div className="text-sm text-red-600">{error}</div> : null}

        <button
          disabled={loading}
          className="mt-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {loading ? "ログイン中…" : "ログイン"}
        </button>
      </form>
    </div>
  );
}
