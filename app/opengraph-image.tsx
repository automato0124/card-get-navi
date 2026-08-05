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
            overflow: "hidden"
          }}
        >
          <div
            style={{
              width: 345,
              background: "#111111",
              color: "#ffffff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "46px 34px"
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ width: 86, height: 120, border: "4px solid #ffffff", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(-7deg)" }}>
                <div style={{ width: 54, height: 54, border: "9px solid #e60012", borderRadius: 999, background: "#ffffff" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", fontSize: 28, fontWeight: 900, lineHeight: 1.25 }}>
                <div>POKECA</div>
                <div>LOTTERY</div>
              </div>
            </div>
            <div style={{ height: 10, width: 180, background: "#e60012", borderRadius: 999 }} />
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "58px 64px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
              <div style={{ padding: "8px 14px", border: "2px solid #e60012", borderRadius: 999, color: "#e60012", fontSize: 24, fontWeight: 900 }}>
                ポケカ抽選
              </div>
              <div style={{ color: "#555555", fontSize: 24, fontWeight: 800 }}>締切順でチェック</div>
            </div>

            <div style={{ display: "flex", fontSize: 74, fontWeight: 900, lineHeight: 1.08, letterSpacing: 0 }}>
              カードゲットナビ
            </div>

            <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10, color: "#333333", fontSize: 30, fontWeight: 800, lineHeight: 1.35 }}>
              <div>抽選・予約・再販情報をまとめて確認</div>
              <div style={{ color: "#e60012" }}>応募前に公式ページで最新条件を確認</div>
            </div>

            <div style={{ marginTop: 42, display: "flex", gap: 12 }}>
              {["受付中", "締切近い", "近日開始"].map((label) => (
                <div key={label} style={{ border: "2px solid #111111", borderRadius: 999, padding: "10px 18px", fontSize: 24, fontWeight: 900 }}>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
