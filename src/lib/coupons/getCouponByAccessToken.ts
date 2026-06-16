import "server-only";

import { getCouponStatus } from "@/lib/coupons/getCouponStatus";
import { hashAccessToken } from "@/lib/security/hashToken";
import { createAdminClient } from "@/lib/supabase/admin";

const ACCESS_TOKEN_PATTERN = /^ck_[0-9a-f]{32}_[A-Za-z0-9_-]{43}$/;

export async function getCouponByAccessToken(accessToken: string) {
  if (!ACCESS_TOKEN_PATTERN.test(accessToken)) {
    return null;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("coupons")
    .select(
      `
        id,
        code,
        issued_at,
        expires_at,
        used_at,
        campaigns!inner (
          slug,
          title,
          discount_percent,
          stores!inner (
            name,
            naver_url
          )
        )
      `,
    )
    .eq("access_token_hash", hashAccessToken(accessToken))
    .maybeSingle();

  if (error) {
    throw new Error("Could not load coupon.");
  }

  if (!data) {
    return null;
  }

  const status = getCouponStatus({
    usedAt: data.used_at,
    expiresAt: data.expires_at,
  });

  const { error: eventError } = await supabase.from("coupon_events").insert({
    coupon_id: data.id,
    action: status === "EXPIRED" ? "EXPIRED_VIEWED" : "VIEWED",
  });

  if (eventError) {
    console.error("Could not record coupon view.", eventError);
  }

  return {
    id: data.id,
    code: data.code,
    issuedAt: data.issued_at,
    expiresAt: data.expires_at,
    usedAt: data.used_at,
    status,
    campaign: {
      slug: data.campaigns.slug,
      title: data.campaigns.title,
      discountPercent: data.campaigns.discount_percent,
    },
    storeName: data.campaigns.stores.name,
    storeNaverUrl: data.campaigns.stores.naver_url,
  };
}
