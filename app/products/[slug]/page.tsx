import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LotteryCard } from "@/components/lottery-card";
import { getLotteriesWithRelations, getProducts } from "@/lib/cms";
import { createMetadata } from "@/lib/seo";
import { formatTokyo } from "@/lib/time";
import { formatPrice } from "@/lib/utils";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const products = await getProducts();
  const product = products.find((item) => item.slug === slug);
  if (!product) return {};
  return createMetadata({
    title: `${product.name}の抽選・予約・再販情報一覧`,
    description: product.seoDescription || `${product.name}の受付中の抽選・予約販売・再販情報を締切順に掲載。応募条件、締切日時、公式応募ページをまとめて確認できます。`,
    path: `/products/${product.slug}`
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [products, allLotteries] = await Promise.all([getProducts(), getLotteriesWithRelations()]);
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  const lotteries = allLotteries.filter((lottery) => lottery.product.slug === slug);
  const open = lotteries.filter((lottery) => ["open", "closing_soon"].includes(lottery.computedStatus));
  const upcoming = lotteries.filter((lottery) => lottery.computedStatus === "upcoming");
  const ended = lotteries.filter((lottery) => lottery.computedStatus === "ended");
  const related = products.filter((item) => item.cardGameId === product.cardGameId && item.id !== product.id).slice(0, 3);

  return (
    <main className="container space-y-8 py-10">
      <nav className="text-sm text-slate-600" aria-label="パンくず">
        <Link href="/">トップ</Link> / <span>{product.name}</span>
      </nav>
      <section className="grid gap-5 rounded-3xl border border-line bg-white p-5 shadow-sm md:grid-cols-[180px_1fr]">
        <div className="mx-auto grid w-32 aspect-[4/5] place-items-center rounded-2xl bg-brand-50 md:w-full">
          <Image src={product.imageUrl || "/placeholder-pack.svg"} alt="" width={180} height={225} className="h-full w-full object-contain p-4 md:p-5" />
        </div>
        <div className="space-y-4">
          <h1 className="text-xl font-black leading-snug md:text-2xl">{product.name}</h1>
          <p className="leading-7 text-slate-700">{product.description}</p>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div><dt className="font-bold text-slate-500">発売日</dt><dd>{formatTokyo(product.releaseDate, "yyyy/MM/dd")}</dd></div>
            <div><dt className="font-bold text-slate-500">希望小売価格</dt><dd>{formatPrice(product.retailPrice)}</dd></div>
          </dl>
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-2xl font-black">受付中の抽選</h2>
        <div className="grid gap-4">{open.map((lottery) => <LotteryCard key={lottery.id} lottery={lottery} />)}</div>
      </section>
      <section className="space-y-4">
        <h2 className="text-2xl font-black">近日開始の抽選</h2>
        <div className="grid gap-4">{upcoming.map((lottery) => <LotteryCard key={lottery.id} lottery={lottery} />)}</div>
      </section>
      <details className="rounded-3xl border border-line bg-white p-4">
        <summary className="cursor-pointer text-xl font-black">終了済みの抽選 {ended.length}件</summary>
        <div className="mt-4 grid gap-4">{ended.map((lottery) => <LotteryCard key={lottery.id} lottery={lottery} />)}</div>
      </details>
      {related.length ? (
        <section className="space-y-3">
          <h2 className="text-2xl font-black">関連商品</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {related.map((item) => (
              <Link key={item.id} href={`/products/${item.slug}`} className="rounded-2xl border border-line bg-white p-4 font-bold transition hover:bg-brand-50">
                {item.name}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
