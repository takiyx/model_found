import { ImageResponse } from "next/og";
import { prisma } from "@/lib/db";
import { prefectureLabels } from "@/lib/prefectures";

export const runtime = "nodejs";

export const alt = "Model Find Post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const post = await prisma.post.findUnique({
    where: { id },
    include: { images: true, author: true },
  });

  if (!post) {
    return new ImageResponse(
      (
        <div style={{ backgroundColor: "#18181b", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 60, fontWeight: "bold" }}>
          Model Find
        </div>
      ),
      { ...size }
    );
  }

  const bgImg = post.images[0]?.url;
  const modeLabel = post.mode === "PHOTOGRAPHER" ? "撮影者募集" : "モデル募集";
  const prefLabel = post.prefecture ? prefectureLabels[post.prefecture] : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          backgroundColor: "#18181b",
        }}
      >
        {bgImg && (
          <img
            src={bgImg}
            alt=""
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.4,
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "80px",
          }}
        >
          {/* Top Info row */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ padding: "12px 28px", background: "white", color: "black", borderRadius: "100px", fontSize: 28, fontWeight: "bold" }}>
              {modeLabel}
            </div>
            {prefLabel && (
              <div style={{ padding: "12px 28px", background: "white", color: "black", borderRadius: "100px", fontSize: 28, fontWeight: "bold" }}>
                {prefLabel}
              </div>
            )}
            {post.reward && (
              <div style={{ padding: "12px 28px", background: "white", color: "black", borderRadius: "100px", fontSize: 28, fontWeight: "bold", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden", maxWidth: 600 }}>
                {post.reward}
              </div>
            )}
          </div>

          {/* Title row */}
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: "white",
              lineHeight: 1.3,
              marginTop: "auto",
              marginBottom: "40px",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {post.title}
          </div>

          {/* Bottom Branding */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "2px solid rgba(255,255,255,0.2)", paddingTop: "40px" }}>
            <div style={{ color: "white", fontSize: 32, fontWeight: "bold", opacity: 0.9 }}>
              {post.author.displayName}
            </div>
            <div style={{ color: "white", fontSize: 30, fontWeight: "bold", opacity: 0.6 }}>
              model-find.com
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
