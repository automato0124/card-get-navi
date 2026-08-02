import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LotteryCard } from "@/components/lottery-card";
import { getCardGames, getLotteriesWithRelations, getProducts } from "@/lib/cms";
import { createMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const cardGames = await getCardGames();
  return cardGames.map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cardGames = await getCardGames();
  const game = cardGames.find((item) => item.slug === slug);
  return game ? createMetadata({
    title: `${game.name}の抽選・予約情報`,
    description: `${game.name}の抽選販売、予約、再販情報を締切順に確認できます。応募条件と公式応募ページをまとめてチェックできます。`,
    path: `/cards/${game.slug}`
  }) : {};
}

export default async function CardGamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [cardGames, products, allLotteries] = await Promise.all([getCardGames(), getProducts(), getLotteriesWithRelations()]);
  const game = cardGames.find((item) => item.slug === slug);
  if (!game) notFound();
  const gameProducts = products.filter((product) => product.cardGameId === game.id);
  const lotteries = allLotteries.filter((lottery) => lottery.cardGame.slug === slug);
  const open = lotteries.filter((lottery) => ["open", "closing_soon"].includes(lottery.computedStatus));
  const ended = lotteries.filter((lottery) => lottery.computedStatus === "ended");
  return (
    <main className="container space-y-8 py-10">
      <nav className="text-sm text-slate-600" aria-label="パンくず"><Link href="/">トップ</Link> / <span>{game.name}</span></nav>
      <section className="space-y-3">
        <h1 className="text-2xl font-black md:text-3xl">{game.name}</h1>
        <p className="leading-7 text-slate-700">{game.description}</p>
        <p className="font-bold text-brand-700">受付中 {open.length}件</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-black">商品一覧</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{gameProducts.map((product) => <Link key={product.id} href={`/products/${product.slug}`} className="rounded-3xl border border-line bg-white p-4 font-bold">{product.name}</Link>)}</div>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-black">受付中の抽選</h2>
        <div className="grid gap-4">{open.map((lottery) => <LotteryCard key={lottery.id} lottery={lottery} />)}</div>
      </section>
      <details className="rounded-3xl border border-line bg-white p-4">
        <summary className="cursor-pointer text-xl font-black">終了済みの抽選 {ended.length}件</summary>
        <div className="mt-4 grid gap-4">{ended.map((lottery) => <LotteryCard key={lottery.id} lottery={lottery} />)}</div>
      </details>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: `${game.name}の抽選はどこで確認できますか？`, acceptedAnswer: { "@type": "Answer", text: "受付中一覧と商品ページで締切順に確認できます。" } }] }) }} />
    </main>
  );
}
