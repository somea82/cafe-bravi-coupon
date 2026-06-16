const COUPON_CODE_PATTERN = /^BRAVI-[A-Z0-9]{5,12}$/;
const COUPON_SUFFIX_PATTERN = /^[A-Z0-9]{5,12}$/;

export function normalizeCouponCode(value: string) {
  const normalized = value.trim().toUpperCase().replaceAll(/\s+/g, "");

  if (COUPON_CODE_PATTERN.test(normalized)) {
    return normalized;
  }

  if (COUPON_SUFFIX_PATTERN.test(normalized)) {
    return `BRAVI-${normalized}`;
  }

  return null;
}
