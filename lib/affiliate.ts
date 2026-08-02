import type { AffiliateCampaign } from "./types";

export function isCampaignActive(campaign: AffiliateCampaign, now = new Date()) {
  if (!campaign.isActive) return false;
  return new Date(campaign.startAt) <= now && now <= new Date(campaign.endAt);
}

export function campaignHref(campaign: AffiliateCampaign) {
  if (campaign.trackingMode === "internal_redirect") return `/go/${campaign.id}`;
  return campaign.trackingUrl || campaign.destinationUrl;
}
