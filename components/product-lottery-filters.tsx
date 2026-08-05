"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function ProductLotteryFilters({
  shops,
  prefectures
}: {
  shops: Array<[string, string]>;
  prefectures: Array<[string, string]>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  return (
    <section id="lotteries" className="grid gap-4 scroll-mt-24 sm:grid-cols-2" aria-label="商品別抽選フィルター">
      {field("shop", "店舗", shops)}
      {field("prefecture", "エリア", prefectures)}
    </section>
  );
}
