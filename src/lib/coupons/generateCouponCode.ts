import "server-only";

import { randomInt } from "node:crypto";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateCouponCode(length = 5) {
  const suffix = Array.from(
    { length },
    () => ALPHABET[randomInt(ALPHABET.length)],
  ).join("");

  return `BRAVI-${suffix}`;
}
