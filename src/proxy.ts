import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/auth/updateSession";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
