import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { AdultDisclaimerBanner } from "@/components/adult-disclaimer-banner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    default: "モデルひろば（モダン）",
    template: "%s | モデルひろば（モダン）",
  },
  description: "モデルと撮影者をつなぐ、シンプルなマッチング掲示板（デモ）",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-dvh bg-zinc-50 text-zinc-900">
          <SiteHeader />
          <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
            {children}
          </main>
          <footer className="border-t bg-white">
            <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-zinc-500 sm:px-6">
              <div className="grid gap-3">
                <p>
                  注意：これはデモ実装です。高額報酬・外部連絡の案件は条件を十分に確認し、
                  安全にご利用ください。
                </p>
                <p className="text-xs text-zinc-500">
                  当サイトには成人向け（性的表現を含む）の募集・表現が含まれる可能性があります。
                  18歳未満の方はご利用いただけません。
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
                  <a className="hover:text-zinc-900 underline-offset-2 hover:underline" href="/rules">
                    ルール
                  </a>
                  <a className="hover:text-zinc-900 underline-offset-2 hover:underline" href="/tags">
                    タグ
                  </a>
                  <a className="hover:text-zinc-900 underline-offset-2 hover:underline" href="/settings/security">
                    セキュリティ
                  </a>
                </div>
              </div>
            </div>
          </footer>

          <AdultDisclaimerBanner />
        </div>
      </body>
    </html>
  );
}
