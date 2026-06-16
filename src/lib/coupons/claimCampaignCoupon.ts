import "server-only";

import { getCampaignBySlug } from "@/lib/campaigns/getCampaignBySlug";
import { hasValidQrEntry } from "@/lib/campaigns/hasValidQrEntry";
import { createCoupon } from "@/lib/coupons/createCoupon";
import { getVisitorByKey } from "@/lib/visitors/getVisitorByKey";

export type CouponClaimErrorCode =
  | "CAMPAIGN_NOT_FOUND"
  | "QR_ENTRY_REQUIRED"
  | "VISITOR_REQUIRED";

export class CouponClaimError extends Error {
  constructor(
    public readonly code: CouponClaimErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "CouponClaimError";
  }
}

type ClaimCampaignCouponInput = {
  slug: string;
  visitorKey?: string;
  siteUrl: string;
};

export async function claimCampaignCoupon({
  slug,
  visitorKey,
  siteUrl,
}: ClaimCampaignCouponInput) {
  const visitor = await getVisitorByKey(visitorKey);

  if (!visitor) {
    throw new CouponClaimError(
      "VISITOR_REQUIRED",
      "Visitor cookie is missing or invalid.",
    );
  }

  const campaign = await getCampaignBySlug(slug);

  if (!campaign) {
    throw new CouponClaimError(
      "CAMPAIGN_NOT_FOUND",
      "Campaign does not exist.",
    );
  }

  const hasQrAccess = await hasValidQrEntry(slug, visitorKey);

  if (!hasQrAccess) {
    throw new CouponClaimError(
      "QR_ENTRY_REQUIRED",
      "A recent QR entry is required.",
    );
  }

  const result = await createCoupon({
    campaignId: campaign.id,
    visitorId: visitor.id,
    siteUrl,
  });

  return {
    ...result,
    discountPercent: campaign.discount_percent,
  };
}
