import Link from "next/link";
import Image from "next/image";
import { ExternalLink, MapPin } from "lucide-react";
import { formatTokyo, remainingTimeLabel } from "@/lib/time";
import type { LotteryWithRelations } from "@/lib/types";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./status-badge";

const methodLabel = {
  online: "オンライン",
  store: "店頭",
  app: "アプリ",
  sns: "SNS",
  line: "LINE"
};

function ctaLabel(lottery: LotteryWithRelations, openLabel = "応募する！") {
  if (!lottery.officialApplicationUrl) return "詳細確認中";
  if (lottery.computedStatus === "upcoming") return "応募条件を確認する";
  if (lottery.computedStatus === "ended") return "受付終了";
  return openLabel;
}

function isRecommendedShop(lottery: LotteryWithRelations) {
  return lottery.shop.slug === "oripa-freaks" || lottery.shop.slug === "amazon";
}

function hasUnknownDeadline(lottery: LotteryWithRelations) {
  if (lottery.shop.slug === "amazon") return true;
  if (isRecommendedShop(lottery)) return true;
  if (!lottery.endAt) return true;
  const year = Number(lottery.endAt.slice(0, 4));
  return Number.isFinite(year) && year >= 2090;
}

function deadlineLabel(lottery: LotteryWithRelations) {
  if (isRecommendedShop(lottery)) return "-";
  return hasUnknownDeadline(lottery) ? "調査中" : formatTokyo(lottery.endAt, "M/d HH:mm");
}

export function LotteryCard({
  lottery,
  compact = false,
  titleBy = "product",
  openCtaLabel = "応募する！",
  ctaHrefMode = "application",
  showLocation = true,
  showShop = true
}: {
  lottery: LotteryWithRelations;
  compact?: boolean;
  titleBy?: "product" | "shop";
  openCtaLabel?: string;
  ctaHrefMode?: "application" | "product";
  showLocation?: boolean;
  showShop?: boolean;
}) {
  const disabled = lottery.computedStatus === "ended" || !lottery.officialApplicationUrl;
  const title = titleBy === "shop" ? lottery.shop.name : lottery.product.name;
  const titleHref = titleBy === "shop" ? `/shops/${lottery.shop.slug}` : `/products/${lottery.product.slug}`;
  const ctaHref = ctaHrefMode === "product" ? `/products/${lottery.product.slug}` : lottery.officialApplicationUrl;
  const ctaDisabled = ctaHrefMode === "application" && disabled;
  const recommended = isRecommendedShop(lottery);
  const imageUrl = lottery.product.imageUrl;
  const showImage = titleBy === "product" && Boolean(imageUrl);
  const showMeta = (titleBy === "product" && showShop) || showLocation;
  const unknownDeadline = hasUnknownDeadline(lottery);
  return (
    <article
      className={cn(
        "group relative border-b border-line bg-white transition hover:bg-brand-50/40",
        compact ? "py-4" : "py-5"
      )}
    >
      <Link href={`/products/${lottery.product.slug}`} className="absolute inset-0 z-0" aria-label={`${lottery.product.name}の詳細を見る`} />
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_240px]">
        <div className={cn("grid min-w-0 items-center gap-3 sm:gap-4", showImage ? "grid-cols-[82px_1fr] sm:grid-cols-[96px_1fr]" : "grid-cols-1")}>
          {showImage ? (
            <div className="relative z-10 grid aspect-[4/5] place-items-center">
              <Image
                src={imageUrl!}
                alt=""
                width={96}
                height={120}
                className="h-full w-full object-contain"
              />
            </div>
          ) : null}
          <div className="min-w-0 space-y-2.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <StatusBadge status={lottery.computedStatus} />
              <span className="rounded-full border border-line bg-white px-2 py-0.5 text-[10px] font-bold text-slate-700">{methodLabel[lottery.applicationMethod]}</span>
            </div>
            <h3 className="break-words text-sm font-black leading-snug text-ink sm:text-base">
              <Link href={titleHref} className="relative z-10 hover:text-brand-700">
                {title}
              </Link>
            </h3>
            {showMeta ? (
              <p className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold text-slate-700">
                {titleBy === "product" && showShop ? <span>{lottery.shop.name}</span> : null}
                {showLocation ? (
                  <span className="inline-flex items-center gap-1 text-slate-600">
                    <MapPin className="h-3.5 w-3.5" aria-hidden />
                    {lottery.prefecture}
                  </span>
                ) : null}
              </p>
            ) : null}
          </div>
        </div>
        <div className="grid gap-3.5 border-l border-line pl-5 max-md:border-l-0 max-md:border-t max-md:pt-5 max-md:pl-0">
          <dl className="text-xs text-slate-700">
            <div className="px-1 py-1">
              <dt className="font-bold text-slate-500">締切</dt>
              <dd className="mt-1 font-black text-[#e60012]">{deadlineLabel(lottery)}</dd>
            </div>
          </dl>
          {recommended ? (
            <p>
              <span className="inline-flex w-fit rounded-full bg-[#e60012] px-2.5 py-1 text-xs font-black leading-none text-white">おすすめ！</span>
            </p>
          ) : !unknownDeadline ? (
            <p className="px-1 text-sm font-black text-[#e60012]">{remainingTimeLabel(lottery.endAt)}</p>
          ) : null}
          <a
            href={ctaDisabled ? undefined : ctaHref}
            aria-disabled={ctaDisabled}
            target={ctaHrefMode === "application" ? "_blank" : undefined}
            rel={ctaHrefMode === "application" ? "sponsored nofollow noopener noreferrer" : undefined}
            className={cn(
              "relative z-10 inline-flex min-h-10 items-center justify-center gap-1.5 rounded-2xl px-3 py-2 text-xs font-black transition",
              ctaDisabled
                ? "cursor-not-allowed bg-slate-200 text-slate-500"
                : lottery.computedStatus === "upcoming"
                  ? "border-2 border-slate-300 bg-slate-100 text-slate-600 hover:bg-slate-200"
                : "border-2 border-ink bg-accent-yellow text-ink shadow-[3px_3px_0_#2866c7] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#2866c7]"
            )}
          >
            {ctaLabel(lottery, openCtaLabel)}
            {!ctaDisabled && ctaHrefMode === "application" ? <ExternalLink className="h-3.5 w-3.5" aria-hidden /> : null}
          </a>
        </div>
      </div>
    </article>
  );
}
