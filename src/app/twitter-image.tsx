import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 600,
};

export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "linear-gradient(135deg, #0a0a0a 0%, #111827 60%, #0f172a 100%)",
          color: "#fff",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        }}
      >
        <div style={{ fontSize: 58, fontWeight: 800, letterSpacing: -1 }}>Model Find</div>
        <div style={{ marginTop: 18, fontSize: 28, opacity: 0.9 }}>
          モデルと撮影者の募集を、画像中心で見つけよう。
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
