export type CouponStatus = "AVAILABLE" | "USED" | "EXPIRED";

type CouponStatusInput = {
  usedAt: string | null;
  expiresAt: string;
};

export function getCouponStatus(
  coupon: CouponStatusInput,
  now = new Date(),
): CouponStatus {
  if (coupon.usedAt) {
    return "USED";
  }

  if (new Date(coupon.expiresAt).getTime() <= now.getTime()) {
    return "EXPIRED";
  }

  return "AVAILABLE";
}
