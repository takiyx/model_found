-- CreateEnum
CREATE TYPE "Region" AS ENUM ('EAST', 'WEST');

-- CreateEnum
CREATE TYPE "Prefecture" AS ENUM ('HOKKAIDO', 'AOMORI', 'IWATE', 'MIYAGI', 'AKITA', 'YAMAGATA', 'FUKUSHIMA', 'IBARAKI', 'TOCHIGI', 'GUNMA', 'SAITAMA', 'CHIBA', 'TOKYO', 'KANAGAWA', 'NIIGATA', 'TOYAMA', 'ISHIKAWA', 'FUKUI', 'YAMANASHI', 'NAGANO', 'GIFU', 'SHIZUOKA', 'AICHI', 'MIE', 'SHIGA', 'KYOTO', 'OSAKA', 'HYOGO', 'NARA', 'WAKAYAMA', 'TOTTORI', 'SHIMANE', 'OKAYAMA', 'HIROSHIMA', 'YAMAGUCHI', 'TOKUSHIMA', 'KAGAWA', 'EHIME', 'KOCHI', 'FUKUOKA', 'SAGA', 'NAGASAKI', 'KUMAMOTO', 'OITA', 'MIYAZAKI', 'KAGOSHIMA', 'OKINAWA');

-- CreateEnum
CREATE TYPE "PostMode" AS ENUM ('PHOTOGRAPHER', 'MODEL');

-- CreateEnum
CREATE TYPE "NotificationKind" AS ENUM ('FAVORITE_USER', 'FAVORITE_POST', 'THREAD_MESSAGE');

-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('SPAM', 'SCAM', 'HARASSMENT', 'IMPERSONATION', 'ILLEGAL', 'UNDERAGE', 'OTHER');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('OPEN', 'RESOLVED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "bio" TEXT NOT NULL DEFAULT '',
    "prefecture" "Prefecture",
    "basePlace" TEXT NOT NULL DEFAULT '',
    "interests" TEXT NOT NULL DEFAULT '',
    "avatarUrl" TEXT NOT NULL DEFAULT '',
    "websiteUrl" TEXT NOT NULL DEFAULT '',
    "instagramHandle" TEXT NOT NULL DEFAULT '',
    "xHandle" TEXT NOT NULL DEFAULT '',
    "portfolioText" TEXT NOT NULL DEFAULT '',
    "portfolioImages" TEXT NOT NULL DEFAULT '[]',
    "shootOkText" TEXT NOT NULL DEFAULT '',
    "shootNgText" TEXT NOT NULL DEFAULT '',
    "isPhotographer" BOOLEAN NOT NULL DEFAULT true,
    "isModel" BOOLEAN NOT NULL DEFAULT true,
    "acceptedAdultAt" TIMESTAMP(3),
    "bannedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "region" "Region" NOT NULL,
    "prefecture" "Prefecture" NOT NULL DEFAULT 'TOKYO',
    "mode" "PostMode" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "reward" TEXT NOT NULL DEFAULT '',
    "place" TEXT NOT NULL DEFAULT '',
    "dateText" TEXT NOT NULL DEFAULT '',
    "tags" TEXT NOT NULL DEFAULT '',
    "contactText" TEXT NOT NULL DEFAULT '',
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostImage" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Thread" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Thread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThreadParticipant" (
    "threadId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lastReadAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ThreadParticipant_pkey" PRIMARY KEY ("threadId","userId")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoritePost" (
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoritePost_pkey" PRIMARY KEY ("userId","postId")
);

-- CreateTable
CREATE TABLE "FavoriteUser" (
    "userId" TEXT NOT NULL,
    "targetUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteUser_pkey" PRIMARY KEY ("userId","targetUserId")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" "NotificationKind" NOT NULL,
    "actorId" TEXT,
    "postId" TEXT,
    "threadId" TEXT,
    "snippet" TEXT NOT NULL DEFAULT '',
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "targetUserId" TEXT NOT NULL,
    "postId" TEXT,
    "reason" "ReportReason" NOT NULL,
    "detail" TEXT NOT NULL DEFAULT '',
    "status" "ReportStatus" NOT NULL DEFAULT 'OPEN',
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockUser" (
    "blockerId" TEXT NOT NULL,
    "blockedId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlockUser_pkey" PRIMARY KEY ("blockerId","blockedId")
);

-- CreateTable
CREATE TABLE "WeeklyPick" (
    "id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyPick_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Post_region_createdAt_idx" ON "Post"("region", "createdAt");

-- CreateIndex
CREATE INDEX "Post_authorId_createdAt_idx" ON "Post"("authorId", "createdAt");

-- CreateIndex
CREATE INDEX "PostImage_postId_idx" ON "PostImage"("postId");

-- CreateIndex
CREATE INDEX "Thread_postId_updatedAt_idx" ON "Thread"("postId", "updatedAt");

-- CreateIndex
CREATE INDEX "ThreadParticipant_userId_idx" ON "ThreadParticipant"("userId");

-- CreateIndex
CREATE INDEX "Message_threadId_createdAt_idx" ON "Message"("threadId", "createdAt");

-- CreateIndex
CREATE INDEX "Message_senderId_createdAt_idx" ON "Message"("senderId", "createdAt");

-- CreateIndex
CREATE INDEX "FavoritePost_postId_idx" ON "FavoritePost"("postId");

-- CreateIndex
CREATE INDEX "FavoritePost_userId_createdAt_idx" ON "FavoritePost"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "FavoriteUser_targetUserId_idx" ON "FavoriteUser"("targetUserId");

-- CreateIndex
CREATE INDEX "FavoriteUser_userId_createdAt_idx" ON "FavoriteUser"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_userId_readAt_updatedAt_idx" ON "Notification"("userId", "readAt", "updatedAt");

-- CreateIndex
CREATE INDEX "Notification_kind_updatedAt_idx" ON "Notification"("kind", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_userId_kind_threadId_key" ON "Notification"("userId", "kind", "threadId");

-- CreateIndex
CREATE INDEX "Report_targetUserId_status_updatedAt_idx" ON "Report"("targetUserId", "status", "updatedAt");

-- CreateIndex
CREATE INDEX "Report_postId_status_updatedAt_idx" ON "Report"("postId", "status", "updatedAt");

-- CreateIndex
CREATE INDEX "Report_reporterId_createdAt_idx" ON "Report"("reporterId", "createdAt");

-- CreateIndex
CREATE INDEX "BlockUser_blockedId_idx" ON "BlockUser"("blockedId");

-- CreateIndex
CREATE INDEX "BlockUser_blockerId_createdAt_idx" ON "BlockUser"("blockerId", "createdAt");

-- CreateIndex
CREATE INDEX "WeeklyPick_tag_position_idx" ON "WeeklyPick"("tag", "position");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyPick_tag_postId_key" ON "WeeklyPick"("tag", "postId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostImage" ADD CONSTRAINT "PostImage_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThreadParticipant" ADD CONSTRAINT "ThreadParticipant_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThreadParticipant" ADD CONSTRAINT "ThreadParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoritePost" ADD CONSTRAINT "FavoritePost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoritePost" ADD CONSTRAINT "FavoritePost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteUser" ADD CONSTRAINT "FavoriteUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteUser" ADD CONSTRAINT "FavoriteUser_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockUser" ADD CONSTRAINT "BlockUser_blockerId_fkey" FOREIGN KEY ("blockerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockUser" ADD CONSTRAINT "BlockUser_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyPick" ADD CONSTRAINT "WeeklyPick_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
