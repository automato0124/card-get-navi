import { ImageResponse } from "next/og";
import { absoluteUrl } from "@/lib/utils";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const logoUrl = absoluteUrl("/logo-cardgetnavi-pokeca.png");

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
          <img
            src={logoUrl}
            alt="カードゲットナビ"
            width={860}
            height={208}
            style={{ display: "flex", height: 208, objectFit: "contain", width: 860 }}
          />
          <div style={{ marginTop: 34, color: "#333333", display: "flex", fontSize: 30, fontWeight: 900 }}>
            ポケカ抽選・予約・再販情報を締切順にチェック
          </div>
        </div>
      </div>
    ),
    size
  );
}
