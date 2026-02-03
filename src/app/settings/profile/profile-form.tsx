"use client";

import { Prefecture } from "@prisma/client";
import { PrefectureSelect } from "@/components/prefecture-select";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AvatarUploader } from "./avatar-uploader";
import { PortfolioUploader } from "./portfolio-uploader";

export function ProfileForm({
  user,
}: {
  user: {
    displayName: string;
    bio: string;
    prefecture: Prefecture | null;
    basePlace: string;
    interests: string;
    isPhotographer: boolean;
    isModel: boolean;
    avatarUrl: string;
    websiteUrl: string;
    instagramHandle: string;
    xHandle: string;
    portfolioText: string;
    portfolioImages: string;
    shootOkText: string;
    shootNgText: string;
  };
}) {
  const router = useRouter();

  const [displayName, setDisplayName] = useState(user.displayName);
  const [bio, setBio] = useState(user.bio);
  const [prefecture, setPrefecture] = useState<Prefecture>(user.prefecture ?? Prefecture.TOKYO);
  const [usePref, setUsePref] = useState<boolean>(!!user.prefecture);
  const [basePlace, setBasePlace] = useState(user.basePlace);
  const [interests, setInterests] = useState(user.interests);
  const [isPhotographer, setIsPhotographer] = useState(user.isPhotographer);
  const [isModel, setIsModel] = useState(user.isModel);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [websiteUrl, setWebsiteUrl] = useState(user.websiteUrl);
  const [instagramHandle, setInstagramHandle] = useState(user.instagramHandle);
  const [xHandle, setXHandle] = useState(user.xHandle);
  const [portfolioText, setPortfolioText] = useState(user.portfolioText);
  const [shootOkText, setShootOkText] = useState(user.shootOkText);
  const [shootNgText, setShootNgText] = useState(user.shootNgText);
  const [portfolioImages, setPortfolioImages] = useState<string[]>(
    user.portfolioImages ? (JSON.parse(user.portfolioImages) as string[]) : []
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="rounded-3xl border bg-white p-6"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!isPhotographer && !isModel) {
          setLoading(false);
          setError("モデルか撮影者のどちらかは選択してください");
          return;
        }

        const res = await fetch("/api/profile", {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            displayName,
            bio,
            prefecture: usePref ? prefecture : null,
            basePlace,
            interests,
            isPhotographer,
            isModel,
            avatarUrl,
            websiteUrl,
            instagramHandle,
            xHandle,
            portfolioText,
            portfolioImages: JSON.stringify(portfolioImages),
            shootOkText,
            shootNgText,
          }),
        });

        setLoading(false);
        if (!res.ok) {
          setError("保存に失敗しました");
          return;
        }

        router.refresh();
      }}
    >
      <div className="grid gap-4">
        <label className="grid gap-1 text-sm">
          <span className="text-zinc-700">表示名</span>
          <input
            className="rounded-xl border px-3 py-2"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </label>

        <div className="grid gap-2 text-sm">
          <div className="text-zinc-700">あなたは…</div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPhotographer}
              onChange={(e) => setIsPhotographer(e.target.checked)}
            />
            <span>撮影者</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isModel}
              onChange={(e) => setIsModel(e.target.checked)}
            />
            <span>モデル</span>
          </label>
          <div className="text-xs text-zinc-500">※ どちらも選択できます</div>
        </div>

        <div className="grid gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={usePref} onChange={(e) => setUsePref(e.target.checked)} />
            <span className="text-zinc-700">地区（都道府県）を表示する</span>
          </label>
          {usePref ? (
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-700">地区（都道府県）</span>
              <PrefectureSelect
                className="rounded-xl border px-3 py-2"
                value={prefecture}
                onChange={setPrefecture}
              />
            </label>
          ) : null}
        </div>

        <label className="grid gap-1 text-sm">
          <span className="text-zinc-700">現在地（任意）</span>
          <input
            className="rounded-xl border px-3 py-2"
            value={basePlace}
            onChange={(e) => setBasePlace(e.target.value)}
            placeholder="例：渋谷 / 新宿 / 大阪梅田"
          />
        </label>

        <label className="grid gap-1 text-sm">
          <span className="text-zinc-700">興味・希望（任意 / カンマ区切り）</span>
          <input
            className="rounded-xl border px-3 py-2"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="例：ポートレート, ストリート, コスプレ"
          />
        </label>

        <label className="grid gap-1 text-sm">
          <span className="text-zinc-700">自己紹介</span>
          <textarea
            className="min-h-32 rounded-xl border px-3 py-2"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="簡単な自己紹介を書いてください"
          />
        </label>

        <div className="grid gap-4 rounded-3xl border bg-white p-4">
          <div className="text-sm font-medium text-zinc-900">外部リンク（任意）</div>

          <label className="grid gap-1 text-sm">
            <span className="text-zinc-700">Webサイト</span>
            <input
              className="rounded-xl border px-3 py-2"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://..."
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-zinc-700">Instagram（@なし）</span>
            <input
              className="rounded-xl border px-3 py-2"
              value={instagramHandle}
              onChange={(e) => setInstagramHandle(e.target.value)}
              placeholder="yourname"
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-zinc-700">X（@なし）</span>
            <input
              className="rounded-xl border px-3 py-2"
              value={xHandle}
              onChange={(e) => setXHandle(e.target.value)}
              placeholder="yourname"
            />
          </label>
        </div>

        <div className="grid gap-2 rounded-3xl border bg-white p-4">
          <div className="text-sm font-medium text-zinc-900">撮影条件 / NG（特に nude / ポートレート向け）</div>
          <label className="grid gap-1 text-sm">
            <span className="text-zinc-700">OK（可能な範囲）</span>
            <textarea
              className="min-h-24 rounded-xl border px-3 py-2"
              value={shootOkText}
              onChange={(e) => setShootOkText(e.target.value)}
              placeholder="例：ポートレートOK / studio OK / nude: NG（半ヌードは要相談）など"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-zinc-700">NG（不可・注意点）</span>
            <textarea
              className="min-h-24 rounded-xl border px-3 py-2"
              value={shootNgText}
              onChange={(e) => setShootNgText(e.target.value)}
              placeholder="例：当日追加の露出は不可、掲載は事前確認必須、同伴者なしは不可 等"
            />
          </label>
          <div className="text-xs text-zinc-500">※ 境界線を明確にすると、無駄なやり取りが減って安心です。</div>
        </div>

        <div className="grid gap-2 rounded-3xl border bg-white p-4">
          <div className="text-sm font-medium text-zinc-900">ポートフォリオ（任意）</div>
          <label className="grid gap-1 text-sm">
            <span className="text-zinc-700">ポートフォリオ文章</span>
            <textarea
              className="min-h-24 rounded-xl border px-3 py-2"
              value={portfolioText}
              onChange={(e) => setPortfolioText(e.target.value)}
              placeholder="作風、実績、希望など"
            />
          </label>

          <PortfolioUploader
            initialUrls={portfolioImages}
            onUploaded={(urls) => {
              setPortfolioImages(urls);
              router.refresh();
            }}
          />
        </div>

        <div className="rounded-3xl border bg-white p-4">
          <AvatarUploader
            initialUrl={avatarUrl}
            onUploaded={(url) => {
              // Upload API already persisted avatarUrl on the server.
              // Update local preview and refresh server components immediately.
              setAvatarUrl(url);
              router.refresh();
            }}
          />
        </div>

        {error ? <div className="text-sm text-red-600">{error}</div> : null}

        <button
          disabled={loading}
          className="mt-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {loading ? "保存中…" : "保存する"}
        </button>
      </div>
    </form>
  );
}
