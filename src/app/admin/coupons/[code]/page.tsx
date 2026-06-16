import Link from "next/link";

import { AdminHeader } from "@/components/AdminHeader";
import { CouponStatusBadge } from "@/components/CouponStatusBadge";
import { RedeemCouponButton } from "@/components/RedeemCouponButton";
import { requireStaffUser } from "@/lib/auth/staffAuth";
import { formatCouponDate } from "@/lib/coupons/formatCouponDate";
import { getCouponByCode } from "@/lib/coupons/getCouponByCode";

export default async function AdminCouponDetailPage({
  params,
}: PageProps<"/admin/coupons/[code]">) {
  const staff = await requireStaffUser();
  const { code } = await params;
  const coupon = await getCouponByCode(code);

  return (
    <section className="mx-auto w-full max-w-2xl py-8">
      <AdminHeader email={staff.email} />
      <Link
        className="text-sm font-bold text-[#6f3d24] underline underline-offset-4"
        href="/admin/coupons"
      >
        다른 쿠폰 조회
      </Link>

      {!coupon ? (
        <div className="mt-8 rounded-3xl border border-[#e4c9bd] bg-[#fff8f3] p-7">
          <h1 className="text-2xl font-bold">쿠폰을 찾을 수 없습니다.</h1>
          <p className="mt-3 leading-7 text-[#746b60]">
            쿠폰번호를 다시 확인해 주세요.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-8 rounded-3xl border border-[#ded4c6] bg-[#fffdf8] p-7 shadow-[0_16px_50px_rgb(70_45_28_/_8%)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-[#746b60]">쿠폰번호</p>
                <h1 className="mt-2 font-mono text-2xl font-bold tracking-[0.08em]">
                  {coupon.code}
                </h1>
              </div>
              <CouponStatusBadge status={coupon.status} />
            </div>

            <dl className="mt-8 grid gap-5 border-t border-[#eee7dc] pt-6 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[#746b60]">매장</dt>
                <dd className="font-semibold">{coupon.storeName}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#746b60]">할인율</dt>
                <dd className="font-semibold">{coupon.discountPercent}%</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#746b60]">발급일</dt>
                <dd className="font-semibold">
                  {formatCouponDate(coupon.issuedAt)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#746b60]">만료일</dt>
                <dd className="font-semibold">
                  {formatCouponDate(coupon.expiresAt)}
                </dd>
              </div>
              {coupon.usedAt ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-[#746b60]">사용일</dt>
                  <dd className="font-semibold">
                    {formatCouponDate(coupon.usedAt)}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>

          <div className="mt-7">
            {coupon.status === "AVAILABLE" ? (
              <RedeemCouponButton code={coupon.code} />
            ) : (
              <div className="rounded-2xl bg-[#eee5d9] px-5 py-4 text-center text-sm leading-6 text-[#5d5248]">
                {coupon.status === "USED"
                  ? "이미 사용 완료된 쿠폰입니다."
                  : "사용기한이 지나 사용할 수 없는 쿠폰입니다."}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
