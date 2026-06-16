import { notFound } from "next/navigation";

import { CopyCouponLinkButton } from "@/components/CopyCouponLinkButton";
import { CouponCard } from "@/components/CouponCard";
import { CurrentTime } from "@/components/CurrentTime";
import { KakaoShareButton } from "@/components/KakaoShareButton";
import { formatCouponDate } from "@/lib/coupons/formatCouponDate";
import { getCouponByAccessToken } from "@/lib/coupons/getCouponByAccessToken";

export default async function CouponPage({
  params,
}: PageProps<"/coupon/[accessToken]">) {
  const { accessToken } = await params;
  const coupon = await getCouponByAccessToken(accessToken);

  if (!coupon) {
    notFound();
  }

  const couponUrl = new URL(
    `/coupon/${accessToken}`,
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ).toString();
  const issuedAt = formatCouponDate(coupon.issuedAt);
  const expiresAt = formatCouponDate(coupon.expiresAt);
  const usedAt = coupon.usedAt ? formatCouponDate(coupon.usedAt) : null;

  return (
    <div className="coupon-invitation-stage">
      <div className="invitation-stage-shade" />
      <section className="coupon-invitation-layout">
        <header className="coupon-invitation-header">
          <p>CAFE BRAVI</p>
          <span>당신을 위한 방문 초대장</span>
          <h1>
          {coupon.storeName} 할인 쿠폰
        </h1>
        </header>

        <CouponCard
          code={coupon.code}
          discountPercent={coupon.campaign.discountPercent}
          expiresAt={expiresAt}
          issuedAt={issuedAt}
          status={coupon.status}
          usedAt={usedAt}
        />

        <div className="coupon-current-time">
        <CurrentTime />
      </div>

        <div className="coupon-usage-note">
        {coupon.status === "AVAILABLE"
            ? "방문 시 이 화면을 직원에게 보여주세요. 직원이 서버에서 쿠폰 상태를 확인한 뒤 사용 처리합니다."
          : coupon.status === "USED"
            ? "이미 사용 완료된 쿠폰입니다."
            : "사용기한이 지난 쿠폰입니다."}
      </div>

        <div className="coupon-invitation-actions">
        <KakaoShareButton
          couponCode={coupon.code}
          couponUrl={couponUrl}
          discountPercent={coupon.campaign.discountPercent}
          expiresAt={expiresAt}
          javascriptKey={process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY}
        />
        <CopyCouponLinkButton couponUrl={couponUrl} />
        {coupon.storeNaverUrl ? (
          <a
            className="flex min-h-12 w-full items-center justify-center rounded-2xl border border-[#03c75a] bg-white px-5 text-sm font-bold text-[#03a94f] transition hover:bg-[#f3fff8]"
            href={coupon.storeNaverUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            네이버 지도에서 카페 브라비 보기
          </a>
        ) : null}
      </div>

        <p className="coupon-save-note">
        쿠폰을 잃어버리지 않도록 카카오톡이나 링크로 저장해 주세요.
      </p>
    </section>
    </div>
  );
}
