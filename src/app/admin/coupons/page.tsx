import { AdminHeader } from "@/components/AdminHeader";
import { CouponSearchForm } from "@/components/CouponSearchForm";
import { requireStaffUser } from "@/lib/auth/staffAuth";

export default async function AdminCouponsPage() {
  const staff = await requireStaffUser();

  return (
    <section className="mx-auto w-full max-w-2xl py-8">
      <AdminHeader email={staff.email} />
      <p className="text-xs font-extrabold tracking-[0.16em] text-[#6f3d24]">
        COUPON LOOKUP
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em]">
        쿠폰 조회
      </h1>
      <p className="mt-4 leading-7 text-[#746b60]">
        고객이 보여주는 쿠폰번호를 입력해 서버에 저장된 상태를 확인합니다.
      </p>
      <CouponSearchForm />
      <div className="mt-6 rounded-2xl bg-[#eee5d9] px-5 py-4 text-sm leading-6 text-[#5d5248]">
        고객 화면이나 캡처만 보고 할인하지 마세요. 이 관리자 화면에서 상태가
        <strong> 사용 가능</strong>일 때만 할인 후 사용 처리합니다.
      </div>
    </section>
  );
}
