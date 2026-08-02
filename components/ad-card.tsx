import { ExternalLink } from "lucide-react";
import { campaignHref } from "@/lib/affiliate";
import type { AffiliateCampaign } from "@/lib/types";

export function AdCard({ campaign }: { campaign: AffiliateCampaign }) {
  return (
    <aside className="border-y border-dashed border-slate-300 py-5" aria-label="広告">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[11px] font-black text-orange-800">PR</span>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-700">広告</span>
        <span className="text-[11px] font-medium text-slate-500">アフィリエイト広告を含みます</span>
      </div>
      <h3 className="text-sm font-black text-ink">{campaign.title}</h3>
      <p className="mt-1 text-sm text-slate-700">{campaign.description}</p>
      <p className="mt-2 text-xs font-bold text-brand-700">{campaign.benefitText}</p>
      <p className="mt-1 text-xs text-slate-500">広告主: {campaign.advertiserName}</p>
      <a
        href={campaignHref(campaign)}
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
        className="mt-3 inline-flex items-center gap-2 rounded-full bg-ink px-3 py-2 text-xs font-bold text-white hover:bg-brand-700"
      >
        {campaign.ctaLabel}
        <ExternalLink className="h-4 w-4" aria-hidden />
      </a>
    </aside>
  );
}
