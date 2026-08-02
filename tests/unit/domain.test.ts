import { describe, expect, it } from "vitest";
import { addHours, subHours } from "date-fns";
import { isCampaignActive } from "@/lib/affiliate";
import { isAllowedExternalUrl } from "@/lib/security";
import { computeLotteryStatus, formatTokyo, remainingTimeLabel } from "@/lib/time";
import type { AffiliateCampaign } from "@/lib/types";

describe("lottery status", () => {
  const now = new Date("2026-08-02T03:00:00.000Z");

  it("returns upcoming before start", () => {
    expect(computeLotteryStatus({ startAt: addHours(now, 2).toISOString(), endAt: addHours(now, 5).toISOString(), now })).toBe("upcoming");
  });

  it("returns closing_soon within 24 hours", () => {
    expect(computeLotteryStatus({ startAt: subHours(now, 1).toISOString(), endAt: addHours(now, 5).toISOString(), now })).toBe("closing_soon");
  });

  it("returns open when more than 24 hours remain", () => {
    expect(computeLotteryStatus({ startAt: subHours(now, 1).toISOString(), endAt: addHours(now, 30).toISOString(), now })).toBe("open");
  });

  it("returns ended after deadline", () => {
    expect(computeLotteryStatus({ startAt: subHours(now, 5).toISOString(), endAt: subHours(now, 1).toISOString(), now })).toBe("ended");
  });

  it("respects suspended override", () => {
    expect(computeLotteryStatus({ endAt: addHours(now, 1).toISOString(), statusOverride: "suspended", now })).toBe("suspended");
  });
});

describe("time labels", () => {
  it("formats in Japan time", () => {
    expect(formatTokyo("2026-08-02T03:00:00.000Z")).toBe("2026/08/02 12:00");
  });

  it("shows remaining time", () => {
    expect(remainingTimeLabel("2026-08-02T04:00:00.000Z", new Date("2026-08-02T03:00:00.000Z"))).toContain("残り");
  });
});

describe("security and affiliate", () => {
  it("allows only http and https external urls", () => {
    expect(isAllowedExternalUrl("https://example.com")).toBe(true);
    expect(isAllowedExternalUrl("javascript:alert(1)")).toBe(false);
  });

  it("checks campaign publication window", () => {
    const campaign: AffiliateCampaign = {
      id: "1",
      advertiserName: "demo",
      title: "demo",
      description: "demo",
      benefitText: "demo",
      destinationUrl: "https://example.com",
      trackingMode: "direct",
      startAt: "2026-08-01T00:00:00.000Z",
      endAt: "2026-08-03T00:00:00.000Z",
      priority: 1,
      placement: "home_top",
      ctaLabel: "見る",
      isActive: true
    };
    expect(isCampaignActive(campaign, new Date("2026-08-02T00:00:00.000Z"))).toBe(true);
  });
});
