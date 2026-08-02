import { NextResponse } from "next/server";
import { getAffiliateCampaigns } from "@/lib/cms";

export async function GET() {
  const affiliateCampaigns = await getAffiliateCampaigns();
  return NextResponse.json({ data: affiliateCampaigns });
}
