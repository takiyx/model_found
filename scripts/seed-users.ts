import { config } from 'dotenv'
config({ path: '.env.local' })
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const users = [
    { email: 'model01@example.com', name: 'Miku_Model', bio: '都内を中心に被写体やっています。よろしくお願いします！', prefecture: 'TOKYO', isPhotographer: false, isModel: true },
    { email: 'model02@example.com', name: 'Rina', bio: '休日に撮影モデルをしています！透明感のある写真が好きです。', prefecture: 'KANAGAWA', isPhotographer: false, isModel: true },
    { email: 'photo01@example.com', name: 'Ken_Photo', bio: 'ポートレート撮影歴3年。週末に撮影できる方を探しています。', prefecture: 'TOKYO', isPhotographer: true, isModel: false },
    { email: 'photo02@example.com', name: 'Sho_Camera', bio: '自然光を活かした透明感のある写真が好きです。相互無償メイン。', prefecture: 'SAITAMA', isPhotographer: true, isModel: false },
    { email: 'photo03@example.com', name: 'Taku', bio: 'スタジオでの作品撮りできる方募集しています！有償依頼も可能です。', prefecture: 'CHIBA', isPhotographer: true, isModel: false },
  ];

  const passwordHash = await bcrypt.hash('Password123!', 10)

  for (const u of users) {
    await prisma.user.upsert({
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
    })
    console.log(`Created/Verified user: ${u.email}`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
