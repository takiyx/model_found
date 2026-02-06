import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #0a0a0a 0%, #111827 60%, #0f172a 100%)",
          color: "#fff",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: -1 }}>Model Find</div>
        <div style={{ marginTop: 24, fontSize: 30, opacity: 0.9 }}>
          モデルと撮影者の募集を、画像中心で見つけよう。
        </div>
        <div style={{ marginTop: 40, fontSize: 22, opacity: 0.7 }}>
          model-find.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
