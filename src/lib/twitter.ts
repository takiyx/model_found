import { TwitterApi } from "twitter-api-v2";
import { prefectureLabels } from "@/lib/prefectures";
import { absoluteUrl } from "@/lib/site";
import { prisma } from "@/lib/db";

let rwClient: any = null;

function getTwitterClient() {
  if (rwClient) return rwClient;
  
  if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_ACCESS_TOKEN) {
    return null;
  }

  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET || "",
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET || "",
  });

  rwClient = client.readWrite;
  return rwClient;
}

/**
 * Automates sharing new posts to the official X (Twitter) account.
 * Highly optimized with marketing hashtags and direct URLs to maximize conversions.
 */
export async function sharePostToTwitter(postId: string) {
  const rwClient = getTwitterClient();
  
  if (!rwClient) {
    console.log("[Twitter Bot] Keys not found in environment. Auto-tweeting is disabled.");
    return;
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { title: true, mode: true, prefecture: true, reward: true, isPublic: true },
    });

    if (!post || !post.isPublic) {
      console.log("[Twitter Bot] Target post is missing or non-public. Skipping.");
      return;
    }

    const isModel = post.mode === "MODEL";
    const modeLabel = isModel ? "モデル募集" : "撮影者募集";
    const prefLabel = prefectureLabels[post.prefecture] || "全国";
    
    const rewardText = post.reward ? `💰 報酬/条件：${post.reward}\n` : "";
    const postUrl = absoluteUrl(`/posts/${postId}`);

    // Highly targeted hashtag strategy for the Nude/Gravure demographic
    const tags = isModel
      ? "#被写体モデル募集 #ポートレートモデル募集 #裏垢女子 #グラビア"
      : "#カメラマン募集 #撮影依頼募集中 #グラビアモデル募集 #被写体募集";

    // Text formatting optimized for X Mobile UI
    const text = `【新規${modeLabel}📸】\n📍 地域：${prefLabel}\n${rewardText}\n📝 ${post.title}\n\n👇詳細・応募はこちら\n${postUrl}\n\n${tags}`;

    await rwClient.v2.tweet(text);
    console.log(`[Twitter Bot] Successfully tweeted post: ${postId}`);
  } catch (error) {
    console.error("[Twitter Bot] Failed to send tweet. Error:", error);
  }
}
