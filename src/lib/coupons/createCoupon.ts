import "server-only";

import { randomUUID } from "node:crypto";

import { generateAccessToken } from "@/lib/coupons/generateAccessToken";
import { generateCouponCode } from "@/lib/coupons/generateCouponCode";
import { hashAccessToken } from "@/lib/security/hashToken";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database, Json } from "@/types/database.types";

type CouponRow = Database["public"]["Tables"]["coupons"]["Row"];

type ClaimCouponResult = {
  created: boolean;
  coupon: CouponRow;
};

function isCouponRow(value: Json | undefined): value is CouponRow {
  return Boolean(
    value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      typeof value.id === "string" &&
      typeof value.code === "string" &&
      typeof value.issued_at === "string" &&
      typeof value.expires_at === "string",
  );
}

function parseClaimResult(value: Json): ClaimCouponResult {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    typeof value.created !== "boolean" ||
    !isCouponRow(value.coupon)
  ) {
    throw new Error("Database returned an invalid coupon claim result.");
  }

  return {
    created: value.created,
    coupon: value.coupon,
  };
}

type CreateCouponInput = {
  campaignId: string;
  visitorId: string;
  siteUrl: string;
};

export async function createCoupon({
  campaignId,
  visitorId,
  siteUrl,
}: CreateCouponInput) {
  const supabase = createAdminClient();

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const couponId = randomUUID();
    const candidateAccessToken = generateAccessToken(couponId);
    const { data, error } = await supabase.rpc("claim_coupon", {
      p_campaign_id: campaignId,
      p_visitor_id: visitorId,
      p_coupon_id: couponId,
      p_code: generateCouponCode(),
      p_access_token_hash: hashAccessToken(candidateAccessToken),
    });

    if (!error && data) {
      const result = parseClaimResult(data);
      const accessToken = generateAccessToken(result.coupon.id);

      return {
        ...result,
        accessToken,
        couponUrl: new URL(
          `/coupon/${accessToken}`,
          siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`,
        ).toString(),
      };
    }

    if (error?.code !== "23505") {
      throw new Error(error?.message ?? "Could not create coupon.");
    }
  }

  throw new Error("Could not allocate a unique coupon identifier.");
}
