import type { NextRequest } from "next/server";

import {
  claimCampaignCoupon,
  CouponClaimError,
} from "@/lib/coupons/claimCampaignCoupon";
import { getCouponStatus } from "@/lib/coupons/getCouponStatus";
import { VISITOR_COOKIE_NAME } from "@/lib/visitors/constants";

export async function POST(
  request: NextRequest,
  context: RouteContext<"/api/campaigns/[slug]/claim">,
) {
  const { slug } = await context.params;

  try {
    const result = await claimCampaignCoupon({
      slug,
      visitorKey: request.cookies.get(VISITOR_COOKIE_NAME)?.value,
      siteUrl: request.nextUrl.origin,
    });

    return Response.json({
      created: result.created,
      couponCode: result.coupon.code,
      couponUrl: result.couponUrl,
      discountPercent: result.discountPercent,
      issuedAt: result.coupon.issued_at,
      expiresAt: result.coupon.expires_at,
      status: getCouponStatus({
        usedAt: result.coupon.used_at,
        expiresAt: result.coupon.expires_at,
      }),
    });
  } catch (error) {
    if (error instanceof CouponClaimError) {
      const status =
        error.code === "CAMPAIGN_NOT_FOUND"
          ? 404
          : error.code === "VISITOR_REQUIRED"
            ? 401
            : 403;

      return Response.json(
        { error: error.code, message: error.message },
        { status },
      );
    }

    console.error("Coupon claim failed.", error);

    return Response.json(
      {
        error: "COUPON_CLAIM_FAILED",
        message: "쿠폰 발급 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
      },
      { status: 500 },
    );
  }
}
