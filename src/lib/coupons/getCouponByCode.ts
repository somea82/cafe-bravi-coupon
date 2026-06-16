import "server-only";

import { getCouponStatus } from "@/lib/coupons/getCouponStatus";
import { normalizeCouponCode } from "@/lib/coupons/normalizeCouponCode";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getCouponByCode(rawCode: string) {
  const code = normalizeCouponCode(rawCode);

  if (!code) {
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
        used_by,
        campaigns!inner (
          title,
          discount_percent,
          stores!inner (
            name
          )
        )
      `,
    )
    .eq("code", code)
    .maybeSingle();

  if (error) {
    throw new Error("Could not load coupon by code.");
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    code: data.code,
    issuedAt: data.issued_at,
    expiresAt: data.expires_at,
    usedAt: data.used_at,
    usedBy: data.used_by,
    status: getCouponStatus({
      usedAt: data.used_at,
      expiresAt: data.expires_at,
    }),
    campaignTitle: data.campaigns.title,
    discountPercent: data.campaigns.discount_percent,
    storeName: data.campaigns.stores.name,
  };
}
