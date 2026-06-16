import "server-only";

import { createHash, createHmac } from "node:crypto";

function requireSecret(
  name: "COOKIE_SECRET" | "COUPON_TOKEN_SECRET" | "QR_TOKEN_SECRET",
) {
  const secret = process.env[name];

  if (!secret) {
    throw new Error(`${name} is not configured.`);
  }

  return secret;
}

export function signCouponId(couponId: string) {
  return createHmac("sha256", requireSecret("COUPON_TOKEN_SECRET"))
    .update(couponId)
    .digest("base64url");
}

export function hashQrToken(token: string) {
  return createHmac("sha256", requireSecret("QR_TOKEN_SECRET"))
    .update(token)
    .digest("hex");
}

export function hashVisitorKey(visitorKey: string) {
  return createHmac("sha256", requireSecret("COOKIE_SECRET"))
    .update(visitorKey)
    .digest("hex");
}

export function hashAccessToken(accessToken: string) {
  return createHash("sha256").update(accessToken).digest("hex");
}
