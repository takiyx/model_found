"use client";

import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function LogoutPage() {
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFallback(true), 1500);

    void signOut({ redirect: true, callbackUrl: "/" }).catch(() => {
      // If NextAuth signOut fails (e.g. dev port mismatch), still let the user escape.
      setFallback(true);
    });

    // Hard fallback: navigate home after a short delay.
    const hard = setTimeout(() => {
      window.location.href = "/";
    }, 2500);

    return () => {
      clearTimeout(t);
      clearTimeout(hard);
    };
  }, []);

  return (
    <div className="rounded-2xl border bg-white p-6">
      <p className="text-sm text-zinc-600">ログアウトしています…</p>
      {fallback ? (
        <p className="mt-2 text-sm text-zinc-600">
          画面が切り替わらない場合は <a className="underline" href="/">こちら</a>
          をクリックしてください。
        </p>
      ) : null}
    </div>
  );
}
