import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { enterCampaignFromQr } from "@/lib/campaigns/enterCampaignFromQr";
import { QrEntryError } from "@/lib/campaigns/errors";
import {
  VISITOR_COOKIE_MAX_AGE,
  VISITOR_COOKIE_NAME,
} from "@/lib/visitors/constants";

export async function GET(
  request: NextRequest,
  context: RouteContext<"/q/[slug]">,
) {
  const { slug } = await context.params;
  const token = request.nextUrl.searchParams.get("t")?.trim() ?? "";

  try {
    const result = await enterCampaignFromQr({
      slug,
      token,
      existingVisitorKey: request.cookies.get(VISITOR_COOKIE_NAME)?.value,
    });

    const response = NextResponse.redirect(
      new URL(`/event/${result.campaign.slug}`, request.url),
    );

    response.cookies.set(VISITOR_COOKIE_NAME, result.visitor.visitorKey, {
      httpOnly: true,
      maxAge: VISITOR_COOKIE_MAX_AGE,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    if (!(error instanceof QrEntryError) || error.code === "DATABASE_ERROR") {
      console.error("QR entry failed.", error);
    }

    return NextResponse.redirect(
      new URL(`/event/${encodeURIComponent(slug)}?error=invalid_qr`, request.url),
    );
  }
}
