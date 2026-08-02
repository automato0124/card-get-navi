import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#fff4f2", display: "flex", alignItems: "center", justifyContent: "center", padding: 64 }}>
        <div style={{ width: "100%", height: "100%", background: "white", border: "4px solid #e83f36", borderRadius: 24, display: "flex", flexDirection: "column", justifyContent: "center", padding: 64, boxShadow: "18px 18px 0 #2866c7" }}>
          <div style={{ fontSize: 72, fontWeight: 900, color: "#17223b" }}>カードゲットナビ</div>
          <div style={{ marginTop: 24, fontSize: 38, color: "#c82f29" }}>ポケカ抽選・予約・再販情報を締切順にチェック</div>
          <div style={{ marginTop: 34, width: 180, height: 16, background: "#ffd84d", borderRadius: 999 }} />
        </div>
      </div>
    ),
    size
  );
}
