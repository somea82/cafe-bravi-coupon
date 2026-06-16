import { getStaffUser } from "@/lib/auth/staffAuth";
import { normalizeCouponCode } from "@/lib/coupons/normalizeCouponCode";
import {
  CouponNotRedeemableError,
  redeemCoupon,
} from "@/lib/coupons/redeemCoupon";
import { isSameOriginRequest } from "@/lib/security/isSameOriginRequest";

export async function POST(
  request: Request,
  context: RouteContext<"/api/admin/coupons/[code]/redeem">,
) {
  if (!isSameOriginRequest(request)) {
    return Response.json(
      { error: "INVALID_ORIGIN", message: "허용되지 않은 요청입니다." },
      { status: 403 },
    );
  }

  const staff = await getStaffUser();

  if (!staff) {
    return Response.json(
      { error: "STAFF_AUTH_REQUIRED", message: "직원 로그인이 필요합니다." },
      { status: 401 },
    );
  }

  const { code: rawCode } = await context.params;
  const code = normalizeCouponCode(rawCode);

  if (!code) {
    return Response.json(
      { error: "INVALID_COUPON_CODE", message: "쿠폰번호를 확인해 주세요." },
      { status: 400 },
    );
  }

  try {
    const coupon = await redeemCoupon(code, staff.id);

    return Response.json({
      couponCode: coupon.code,
      status: "USED",
      usedAt: coupon.used_at,
    });
  } catch (error) {
    if (error instanceof CouponNotRedeemableError) {
      return Response.json(
        {
          error: "COUPON_NOT_REDEEMABLE",
          message: "이미 사용되었거나 만료된 쿠폰입니다.",
        },
        { status: 409 },
      );
    }

    console.error("Coupon redeem failed.", error);

    return Response.json(
      {
        error: "COUPON_REDEEM_FAILED",
        message: "쿠폰 사용 처리 중 문제가 발생했습니다.",
      },
      { status: 500 },
    );
  }
}
