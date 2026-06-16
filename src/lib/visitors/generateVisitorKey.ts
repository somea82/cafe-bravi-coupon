import "server-only";

import { randomBytes } from "node:crypto";

export function generateVisitorKey() {
  return `v_${randomBytes(32).toString("base64url")}`;
}
