import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

type CampaignStats = {
  slug: string;
  title: string;
  storeName: string;
  discountPercent: number;
  startsAt: string | null;
  endsAt: string | null;
  isActive: boolean;
};

type DashboardStats = {
  campaign: CampaignStats;
  qr: {
    totalEntries: number;
    uniqueVisitors: number;
    todayEntries: number;
  };
  coupons: {
    issued: number;
    redeemed: number;
    available: number;
    expired: number;
    todayIssued: number;
    todayRedeemed: number;
  };
  rates: {
    claimRate: number;
    redeemRate: number;
    visitConversionRate: number;
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function asNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function parseDashboardStats(value: unknown): DashboardStats {
  if (!isRecord(value)) {
    throw new Error("Dashboard stats payload is invalid.");
  }

  const campaign = isRecord(value.campaign) ? value.campaign : {};
  const qr = isRecord(value.qr) ? value.qr : {};
  const coupons = isRecord(value.coupons) ? value.coupons : {};
  const rates = isRecord(value.rates) ? value.rates : {};

  return {
    campaign: {
      slug: typeof campaign.slug === "string" ? campaign.slug : "",
      title: typeof campaign.title === "string" ? campaign.title : "",
      storeName:
        typeof campaign.storeName === "string" ? campaign.storeName : "",
      discountPercent: asNumber(campaign.discountPercent),
      startsAt: typeof campaign.startsAt === "string" ? campaign.startsAt : null,
      endsAt: typeof campaign.endsAt === "string" ? campaign.endsAt : null,
      isActive: campaign.isActive === true,
    },
    qr: {
      totalEntries: asNumber(qr.totalEntries),
      uniqueVisitors: asNumber(qr.uniqueVisitors),
      todayEntries: asNumber(qr.todayEntries),
    },
    coupons: {
      issued: asNumber(coupons.issued),
      redeemed: asNumber(coupons.redeemed),
      available: asNumber(coupons.available),
      expired: asNumber(coupons.expired),
      todayIssued: asNumber(coupons.todayIssued),
      todayRedeemed: asNumber(coupons.todayRedeemed),
    },
    rates: {
      claimRate: asNumber(rates.claimRate),
      redeemRate: asNumber(rates.redeemRate),
      visitConversionRate: asNumber(rates.visitConversionRate),
    },
  };
}

export async function getDashboardStats(slug = "bravi") {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("get_campaign_dashboard_stats", {
    p_campaign_slug: slug,
  });

  if (error) {
    throw new Error("Could not load dashboard stats.");
  }

  if (!data) {
    return null;
  }

  return parseDashboardStats(data);
}
