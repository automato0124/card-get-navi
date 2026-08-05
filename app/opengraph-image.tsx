import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#f7f7f7",
          color: "#111111",
          display: "flex",
          padding: 54,
          fontFamily: "sans-serif"
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#ffffff",
            border: "3px solid #111111",
            borderRadius: 18,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 72
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
            <div style={{ width: 104, height: 142, border: "6px solid #111111", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(-6deg)" }}>
              <div style={{ width: 58, height: 58, border: "12px solid #e60012", borderRadius: 999 }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", color: "#111111", fontSize: 78, fontWeight: 900, lineHeight: 1, letterSpacing: 0 }}>
                カードゲットナビ
              </div>
              <div style={{ height: 10, width: 300, background: "#e60012", borderRadius: 999 }} />
            </div>
          </div>
          <div style={{ marginTop: 42, color: "#333333", display: "flex", fontSize: 30, fontWeight: 900 }}>
            ポケカ抽選・予約・再販情報
          </div>
        </div>
      </div>
    ),
    size
  );
}
