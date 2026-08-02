"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import type { CardGame, LotteryWithRelations, Shop } from "@/lib/types";

const prefectures = [
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

export function Filters({ cardGames, shops, lotteries }: { cardGames: CardGame[]; shops: Shop[]; lotteries: LotteryWithRelations[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const products = useMemo(
    () => Array.from(new Map(lotteries.map((lottery) => [lottery.product.slug, lottery.product])).values()),
    [lotteries]
  );

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}#lotteries`);
  }

  const field = (key: string, label: string, options: Array<[string, string]>) => (
    <label className="grid min-w-0 gap-1.5 text-xs font-bold text-slate-700">
      <span>{label}</span>
      <select
        value={searchParams.get(key) ?? ""}
        onChange={(event) => update(key, event.target.value)}
        className="h-10 w-full min-w-0 rounded-full border border-line bg-white px-3.5 text-sm font-medium text-ink"
      >
        <option value="">すべて</option>
        {options.map(([value, optionLabel]) => (
          <option key={value} value={value}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );

  const statusButton = (value: string, label: string, className: string, activeClassName: string) => {
    const active = searchParams.get("status") === value;
    return (
      <button
        key={value}
        type="button"
        onClick={() => update("status", active ? "" : value)}
        className={`min-h-10 rounded-2xl border-2 px-3 text-sm font-black text-white shadow-[2px_2px_0_#17223b] transition hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#17223b] active:translate-y-0 active:shadow-[1px_1px_0_#17223b] ${active ? activeClassName : className}`}
        aria-pressed={active}
      >
        {label}
      </button>
    );
  };

  return (
    <section className="py-5" aria-label="抽選情報フィルター">
      <div className="mb-4 grid grid-cols-3 gap-2">
        {statusButton("open", "受付中", "border-emerald-800 bg-emerald-600 hover:bg-emerald-700", "border-emerald-950 bg-emerald-700")}
        {statusButton("closing_soon", "締切近い", "border-red-800 bg-red-600 hover:bg-red-700", "border-red-950 bg-red-700")}
        {statusButton("upcoming", "近日開始", "border-blue-800 bg-blue-600 hover:bg-blue-700", "border-blue-950 bg-blue-700")}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {field("product", "ボックス", products.map((product) => [product.slug, product.name]))}
        {field("method", "抽選方式", [
          ["online", "オンライン"],
          ["store", "店頭"]
        ])}
        {field("shop", "店舗", shops.map((shop) => [shop.slug, shop.name]))}
        {field(
          "prefecture",
          "エリア",
          prefectures.map((prefecture) => [prefecture, prefecture])
        )}
      </div>
    </section>
  );
}
