import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LotteryCard } from "@/components/lottery-card";
import { getLotteriesWithRelations, getShops } from "@/lib/cms";
import { createMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const shops = await getShops();
  return shops.map((shop) => ({ slug: shop.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const shops = await getShops();
  const shop = shops.find((item) => item.slug === slug);
  return shop ? createMetadata({
    title: `${shop.name}の抽選情報`,
    description: `${shop.name}のポケカ抽選・予約・再販情報を確認できます。応募条件、締切日時、公式応募ページを掲載しています。`,
    path: `/shops/${shop.slug}`
  }) : {};
}

export default async function ShopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const shops = await getShops();
  const shop = shops.find((item) => item.slug === slug);
  if (!shop) notFound();
  const lotteries = (await getLotteriesWithRelations()).filter((lottery) => lottery.shop.slug === slug);
  const open = lotteries.filter((lottery) => ["open", "closing_soon"].includes(lottery.computedStatus));
  const ended = lotteries.filter((lottery) => lottery.computedStatus === "ended");
  return (
    <main className="container space-y-8 py-10">
      <nav className="text-sm text-slate-600" aria-label="パンくず"><Link href="/">トップ</Link> / <Link href="/shops">店舗一覧</Link> / <span>{shop.name}</span></nav>
      <section className="space-y-3">
        <h1 className="text-2xl font-black md:text-3xl">{shop.name}</h1>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-black">現在受付中の抽選</h2>
        <div className="grid gap-4">{open.map((lottery) => <LotteryCard key={lottery.id} lottery={lottery} />)}</div>
      </section>
      <details className="rounded-3xl border border-line bg-white p-4">
        <summary className="cursor-pointer text-xl font-black">過去の抽選 {ended.length}件</summary>
        <div className="mt-4 grid gap-4">{ended.map((lottery) => <LotteryCard key={lottery.id} lottery={lottery} />)}</div>
      </details>
      <section className="rounded-3xl border border-line bg-white p-4">
        <h2 className="text-xl font-black">応募時によく必要になる条件</h2>
        <p className="mt-2 text-sm text-slate-700">会員登録、本人確認、店頭受取、購入履歴など。応募前に公式ページで最新条件を確認してください。</p>
      </section>
    </main>
  );
}
