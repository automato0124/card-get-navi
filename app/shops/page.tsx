import type { Metadata } from "next";
import Link from "next/link";
import { getShops } from "@/lib/cms";
import { createMetadata } from "@/lib/seo";

const prefectureOrder = [
  "全国",
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県"
];

export const metadata: Metadata = createMetadata({
  title: "店舗一覧",
  description: "ポケカ抽選・予約情報を掲載している店舗一覧です。オンライン対応や地域別の店舗情報を確認できます。",
  path: "/shops"
});

export default async function ShopsPage() {
  const shops = await getShops();
  const collator = new Intl.Collator("ja-JP");
  const sortedShops = [...shops].sort((a, b) => {
    const areaDiff = prefectureOrder.indexOf(a.prefecture) - prefectureOrder.indexOf(b.prefecture);
    if (areaDiff !== 0) return areaDiff;
    if (a.isOnline !== b.isOnline) return a.isOnline ? -1 : 1;
    return collator.compare(a.name, b.name);
  });
  return (
    <main className="container space-y-6 py-10">
      <h1 className="text-xl font-black md:text-2xl">店舗一覧</h1>
      <div className="grid gap-3">
        {sortedShops.map((shop) => (
          <Link key={shop.id} href={`/shops/${shop.slug}`} className="rounded-3xl border border-line bg-white p-4 shadow-sm">
            <h2 className="text-sm font-bold">{shop.name}</h2>
            <p className="mt-2 text-xs text-slate-600">{shop.prefecture} / {shop.isOnline ? "オンライン対応" : "店頭対応"}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
