import { ChevronDown } from "lucide-react";
import { A8Banner } from "@/components/a8-banner";
import { Filters } from "@/components/filters";
import { LotteryCard } from "@/components/lottery-card";
import { getPublicData } from "@/lib/cms";
import { createMetadata } from "@/lib/seo";
import { parseTokyoDate } from "@/lib/time";
import { absoluteUrl } from "@/lib/utils";
import type { LotteryWithRelations } from "@/lib/types";

export const metadata = createMetadata({
  description: "ポケカの抽選販売、予約、再販情報を締切順に確認できます。応募条件と公式応募ページをまとめてチェックできます。",
  path: "/",
  imageUrl: absoluteUrl("/logo-cardgetnavi-pokeca.png"),
  imageAlt: "カードゲットナビ"
});

type SearchParams = Record<string, string | string[] | undefined>;

const featuredProductSlugs = ["storm-emeralda"];
const affiliateShopSlugs = ["amazon", "oripa-freaks"];

function valueOf(params: SearchParams, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

function filterLotteries(lotteries: LotteryWithRelations[], params: SearchParams) {
  return lotteries.filter((lottery) => {
    const product = valueOf(params, "product");
    const status = valueOf(params, "status");
    const method = valueOf(params, "method");
    const shop = valueOf(params, "shop");
    return (
      (!product || lottery.product.slug === product) &&
      (!status || lottery.computedStatus === status) &&
      (!method || lottery.applicationMethod === method) &&
      (!shop || lottery.shop.slug === shop)
    );
  });
}

function uniqueByProduct(lotteries: LotteryWithRelations[]) {
  const seen = new Set<string>();
  return lotteries.filter((lottery) => {
    if (seen.has(lottery.product.slug)) return false;
    seen.add(lottery.product.slug);
    return true;
  });
}

function isAffiliateLottery(lottery: LotteryWithRelations) {
  return affiliateShopSlugs.includes(lottery.shop.slug);
}

function homeLotteryOrder(a: LotteryWithRelations, b: LotteryWithRelations) {
  const aFeatured = featuredProductSlugs.indexOf(a.product.slug);
  const bFeatured = featuredProductSlugs.indexOf(b.product.slug);
  if (aFeatured !== bFeatured) {
    if (aFeatured === -1) return 1;
    if (bFeatured === -1) return -1;
    return aFeatured - bFeatured;
  }
  if (isAffiliateLottery(a) !== isAffiliateLottery(b)) return isAffiliateLottery(a) ? 1 : -1;
  const aTime = a.endAt ? parseTokyoDate(a.endAt).getTime() : 0;
  const bTime = b.endAt ? parseTokyoDate(b.endAt).getTime() : 0;
  return aTime - bTime;
}

export default async function Home({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const { shops, lotteries: all } = await getPublicData();
  const open = uniqueByProduct(all.filter((item) => ["open", "closing_soon"].includes(item.computedStatus)).sort(homeLotteryOrder));
  const filtered = filterLotteries(all, params).sort(homeLotteryOrder);
  const visibleLotteries = uniqueByProduct(filtered.filter((lottery) => lottery.computedStatus !== "ended"));
  const endedLotteries = uniqueByProduct(filtered.filter((lottery) => lottery.computedStatus === "ended"));

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
          <Filters shops={shops} lotteries={all} />
          <p className="text-[11px] font-bold leading-5 text-slate-500">※PR・広告を含む場合があります。</p>
          <A8Banner />
          {visibleLotteries.length ? (
            <div className="space-y-2">
              <div className="border-t border-line">
                {visibleLotteries.map((lottery) => (
                  <LotteryCard key={lottery.id} lottery={lottery} openCtaLabel="応募先一覧へ" ctaHrefMode="product" showLocation={false} showShop={false} />
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
                  <LotteryCard key={lottery.id} lottery={lottery} openCtaLabel="応募先一覧へ" ctaHrefMode="product" showLocation={false} showShop={false} />
                ))}
              </div>
            </details>
          ) : null}
        </section>
      </div>
    </main>
  );
}
