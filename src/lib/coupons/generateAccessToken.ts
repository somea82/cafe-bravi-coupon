import "server-only";

import { signCouponId } from "@/lib/security/hashToken";

export function generateAccessToken(couponId: string) {
  return `ck_${couponId.replaceAll("-", "")}_${signCouponId(couponId)}`;
}
