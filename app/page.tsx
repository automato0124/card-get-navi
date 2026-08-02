import { ChevronDown } from "lucide-react";
import { Filters } from "@/components/filters";
import { LotteryCard } from "@/components/lottery-card";
import { getPublicData } from "@/lib/cms";
import { createMetadata } from "@/lib/seo";
import { parseTokyoDate } from "@/lib/time";
import { absoluteUrl } from "@/lib/utils";
import type { LotteryWithRelations } from "@/lib/types";

export const metadata = createMetadata({
  description: "ポケカの抽選販売、予約、再販情報を締切順に確認できます。応募条件と公式応募ページをまとめてチェックできます。",
  path: "/"
});

type SearchParams = Record<string, string | string[] | undefined>;

function valueOf(params: SearchParams, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

function filterLotteries(lotteries: LotteryWithRelations[], params: SearchParams) {
  return lotteries.filter((lottery) => {
    const game = valueOf(params, "game");
    const product = valueOf(params, "product");
    const status = valueOf(params, "status");
    const method = valueOf(params, "method");
    const shop = valueOf(params, "shop");
    const prefecture = valueOf(params, "prefecture");
    const requirement = valueOf(params, "requirement");
    return (
      (!game || lottery.cardGame.slug === game) &&
      (!product || lottery.product.slug === product) &&
      (!status || lottery.computedStatus === status) &&
      (!method || lottery.applicationMethod === method) &&
      (!shop || lottery.shop.slug === shop) &&
      (!prefecture || lottery.prefecture === prefecture) &&
      (!requirement || lottery.requirements.includes(requirement))
    );
  });
}

export default async function Home({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const { cardGames, shops, lotteries: all } = await getPublicData();
  const open = all.filter((item) => ["open", "closing_soon"].includes(item.computedStatus));
  const filtered = filterLotteries(all, params).sort((a, b) => {
    const aTime = a.endAt ? parseTokyoDate(a.endAt).getTime() : 0;
    const bTime = b.endAt ? parseTokyoDate(b.endAt).getTime() : 0;
    return aTime - bTime;
  });
  const visibleLotteries = filtered.filter((lottery) => lottery.computedStatus !== "ended");
  const endedLotteries = filtered.filter((lottery) => lottery.computedStatus === "ended");

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: open.slice(0, 10).map((lottery, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/products/${lottery.product.slug}`),
      name: `${lottery.product.name} ${lottery.shop.name}`
    }))
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="container py-8">
        <section id="lotteries" className="space-y-5 scroll-mt-24 border-b border-line pb-8">
          <Filters cardGames={cardGames} shops={shops} lotteries={all} />
          {visibleLotteries.length ? (
            <div className="space-y-2">
              <p className="text-[11px] font-bold leading-5 text-slate-500">※PR・広告を含む場合があります。</p>
              <div className="border-t border-line">
                {visibleLotteries.map((lottery) => (
                  <LotteryCard key={lottery.id} lottery={lottery} />
                ))}
              </div>
            </div>
          ) : endedLotteries.length ? (
            <p className="border-y border-line py-8 text-center text-sm font-bold text-slate-600">
              受付中の抽選情報はありません。受付終了分は下にまとめています。
            </p>
          ) : (
            <p className="border-y border-line py-8 text-center text-sm font-bold text-slate-600">条件に合う抽選情報はありません。</p>
          )}
          {endedLotteries.length ? (
            <details className="group py-4">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 rounded-2xl border border-line bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-brand-50 [&::-webkit-details-marker]:hidden">
                <span>受付終了 {endedLotteries.length}件</span>
                <ChevronDown className="h-4 w-4 text-brand-700 transition group-open:rotate-180" aria-hidden />
              </summary>
              <div className="mt-4 grid gap-4">
                {endedLotteries.map((lottery) => (
                  <LotteryCard key={lottery.id} lottery={lottery} />
                ))}
              </div>
            </details>
          ) : null}
        </section>
      </div>
    </main>
  );
}
