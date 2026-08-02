import { NextResponse } from "next/server";
import { getAffiliateCampaigns } from "@/lib/cms";
import { isCampaignActive } from "@/lib/affiliate";
import { sanitizeExternalUrl } from "@/lib/security";

export async function GET(_request: Request, { params }: { params: Promise<{ campaignId: string }> }) {
  const { campaignId } = await params;
  const affiliateCampaigns = await getAffiliateCampaigns();
  const campaign = affiliateCampaigns.find((item) => item.id === campaignId && item.trackingMode === "internal_redirect" && isCampaignActive(item));
  const destination = sanitizeExternalUrl(campaign?.trackingUrl || campaign?.destinationUrl);
  if (!destination) return NextResponse.redirect(new URL("/", _request.url));
  return NextResponse.redirect(destination);
}
