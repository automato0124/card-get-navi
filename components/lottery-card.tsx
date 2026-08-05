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

function ctaLabel(lottery: LotteryWithRelations) {
  if (!lottery.officialApplicationUrl) return "詳細確認中";
  if (lottery.computedStatus === "upcoming") return "応募条件を確認する";
  if (lottery.computedStatus === "ended") return "受付終了";
  return "応募する";
}

export function LotteryCard({ lottery, compact = false }: { lottery: LotteryWithRelations; compact?: boolean }) {
  const disabled = lottery.computedStatus === "ended" || !lottery.officialApplicationUrl;
  return (
    <article
      className={cn(
        "group relative border-b border-line bg-white transition hover:bg-brand-50/40",
        compact ? "py-5" : "py-6"
      )}
    >
      <Link href={`/products/${lottery.product.slug}`} className="absolute inset-0 z-0" aria-label={`${lottery.product.name}の詳細を見る`} />
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_240px]">
        <div className="grid min-w-0 grid-cols-[60px_1fr] items-center gap-3 sm:grid-cols-[72px_1fr] sm:gap-4">
          <div className="relative z-10 grid aspect-[4/5] place-items-center rounded-2xl bg-brand-50">
            <Image
              src={lottery.product.imageUrl || "/placeholder-pack.svg"}
              alt=""
              width={72}
              height={90}
              className="h-full w-full object-contain p-2.5"
            />
          </div>
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <StatusBadge status={lottery.computedStatus} />
              <span className="rounded-full border border-line bg-white px-2.5 py-1 text-[10px] font-bold text-slate-700">{lottery.cardGame.name}</span>
              <span className="rounded-full border border-line bg-white px-2.5 py-1 text-[10px] font-bold text-slate-700">{methodLabel[lottery.applicationMethod]}</span>
            </div>
            <h3 className="break-words text-base font-black leading-snug text-ink sm:text-lg">
              <Link href={`/products/${lottery.product.slug}`} className="relative z-10 hover:text-brand-700">
                {lottery.product.name}
              </Link>
            </h3>
            <p className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold text-slate-700">
              <span>{lottery.shop.name}</span>
              <span className="inline-flex items-center gap-1 text-slate-600">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                {lottery.prefecture}
              </span>
            </p>
          </div>
        </div>
        <div className="grid gap-3.5 border-l border-line pl-5 max-md:border-l-0 max-md:border-t max-md:pt-5 max-md:pl-0">
          <dl className="grid grid-cols-[0.9fr_1.1fr] gap-3 text-xs text-slate-700">
            <div className="px-1 py-1">
              <dt className="font-bold text-slate-500">開始</dt>
              <dd className="mt-1 font-bold">{formatTokyo(lottery.startAt, "M/d HH:mm")}</dd>
            </div>
            <div className="border-l-2 border-line px-3 py-1">
              <dt className="font-bold text-slate-500">締切</dt>
              <dd className="mt-1 font-black text-[#e60012]">{formatTokyo(lottery.endAt, "M/d HH:mm")}</dd>
            </div>
          </dl>
          <p className="px-1 text-sm font-black text-[#e60012]">
            {remainingTimeLabel(lottery.endAt)}
          </p>
          <a
            href={disabled ? undefined : lottery.officialApplicationUrl}
            aria-disabled={disabled}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className={cn(
              "relative z-10 inline-flex min-h-11 items-center justify-center gap-1.5 rounded-2xl px-3.5 py-2.5 text-sm font-black transition",
              disabled
                ? "cursor-not-allowed bg-slate-200 text-slate-500"
                : lottery.computedStatus === "upcoming"
                  ? "border-2 border-slate-300 bg-slate-100 text-slate-600 hover:bg-slate-200"
                : "border-2 border-ink bg-accent-yellow text-ink shadow-[3px_3px_0_#2866c7] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#2866c7]"
            )}
          >
            {ctaLabel(lottery)}
            {!disabled ? <ExternalLink className="h-3.5 w-3.5" aria-hidden /> : null}
          </a>
        </div>
      </div>
    </article>
  );
}
