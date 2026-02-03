import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProfileForm } from "./profile-form";

export default async function ProfileSettingsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login?callbackUrl=/settings/profile");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      displayName: true,
      bio: true,
      prefecture: true,
      basePlace: true,
      interests: true,
      isPhotographer: true,
      isModel: true,
      avatarUrl: true,
      websiteUrl: true,
      instagramHandle: true,
      xHandle: true,
      portfolioText: true,
      portfolioImages: true,
      shootOkText: true,
      shootNgText: true,
    },
  });

  if (!user) redirect("/");

  return (
    <div className="grid gap-6">
      <header className="rounded-3xl border bg-white p-6">
        <h1 className="text-2xl font-semibold">プロフィール設定</h1>
        <p className="mt-2 text-sm text-zinc-600">固定の自己紹介・希望条件などを編集できます。</p>
      </header>
      <ProfileForm user={user} />
    </div>
  );
}
