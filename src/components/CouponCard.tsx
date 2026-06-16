import Image from "next/image";

import { CouponStatusBadge } from "@/components/CouponStatusBadge";
import type { CouponStatus } from "@/lib/coupons/getCouponStatus";

type CouponCardProps = {
  code: string;
  discountPercent: number;
  expiresAt: string;
  issuedAt: string;
  status: CouponStatus;
  usedAt: string | null;
};

export function CouponCard({
  code,
  discountPercent,
  expiresAt,
  issuedAt,
  status,
  usedAt,
}: CouponCardProps) {
  return (
    <article className="coupon-ticket">
      <div className="coupon-ticket-heading">
        <p className="coupon-ticket-admit">CAFE BRAVI · ADMIT ONE</p>
        <CouponStatusBadge status={status} />
      </div>

      <div className="coupon-ticket-main">
        <div className="coupon-ticket-benefit">
          <div>
            <p>DRINK COUPON</p>
            <strong>{discountPercent}%</strong>
            <span>방문 할인 쿠폰</span>
          </div>
          <div className="coupon-ticket-illustration">
            <Image
              alt=""
              fill
              sizes="150px"
              src="/images/bravi-storefront-illustration.png"
            />
          </div>
        </div>

        <dl className="coupon-ticket-details">
        <div>
            <dt>COUPON NO.</dt>
            <dd className="coupon-ticket-code">{code}</dd>
        </div>
          <div className="coupon-ticket-dates">
          <div>
              <dt>ISSUED</dt>
              <dd>{issuedAt}</dd>
          </div>
          <div>
              <dt>VALID UNTIL</dt>
              <dd>{expiresAt}</dd>
          </div>
        </div>
        {usedAt ? (
          <div>
              <dt>USED</dt>
              <dd>{usedAt}</dd>
          </div>
        ) : null}
      </dl>
      </div>
    </article>
  );
}
