import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: "Unauthorized. Admin only." }, { status: 401 });
  }

  const users = [
    { email: 'model01@example.com', name: 'Miku_Model', bio: '都内を中心に被写体やっています。よろしくお願いします！', prefecture: 'TOKYO', isPhotographer: false, isModel: true },
    { email: 'model02@example.com', name: 'Rina', bio: '休日に撮影モデルをしています！透明感のある写真が好きです。', prefecture: 'KANAGAWA', isPhotographer: false, isModel: true },
    { email: 'photo01@example.com', name: 'Ken_Photo', bio: 'ポートレート撮影歴3年。週末に撮影できる方を探しています。', prefecture: 'TOKYO', isPhotographer: true, isModel: false },
    { email: 'photo02@example.com', name: 'Sho_Camera', bio: '自然光を活かした透明感のある写真が好きです。相互無償メイン。', prefecture: 'SAITAMA', isPhotographer: true, isModel: false },
    { email: 'photo03@example.com', name: 'Taku', bio: 'スタジオでの作品撮りできる方募集しています！有償依頼も可能です。', prefecture: 'CHIBA', isPhotographer: true, isModel: false },
  ];

  try {
    const passwordHash = await bcrypt.hash('Password123!', 10);
    const created = [];

    for (const u of users) {
      const dbUser = await prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: {
          email: u.email,
          passwordHash,
          displayName: u.name,
          bio: u.bio,
          prefecture: u.prefecture as any,
          isPhotographer: u.isPhotographer,
          isModel: u.isModel,
          acceptedAdultAt: new Date(),
        }
      });
      created.push(dbUser.email);
    }

    return NextResponse.json({
      message: "Success! 5 dummy accounts created.",
      password_for_all: "Password123!",
      accounts: created
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
