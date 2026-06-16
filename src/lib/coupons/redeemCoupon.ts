import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { Database, Json } from "@/types/database.types";

type CouponRow = Database["public"]["Tables"]["coupons"]["Row"];

function isCouponRow(value: Json): value is CouponRow {
  return Boolean(
    value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      typeof value.id === "string" &&
      typeof value.code === "string" &&
      typeof value.used_at === "string",
  );
}

export class CouponNotRedeemableError extends Error {
  constructor() {
    super("Coupon is already used, expired, or does not exist.");
    this.name = "CouponNotRedeemableError";
  }
}

export async function redeemCoupon(code: string, staffId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("redeem_coupon", {
    p_code: code,
    p_staff_id: staffId,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data || !isCouponRow(data)) {
    throw new CouponNotRedeemableError();
  }

  return data;
}
