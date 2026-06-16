import type { CouponStatus } from "@/lib/coupons/getCouponStatus";

const STATUS_LABELS: Record<CouponStatus, string> = {
  AVAILABLE: "사용 가능",
  USED: "사용 완료",
  EXPIRED: "만료",
};

const STATUS_CLASSES: Record<CouponStatus, string> = {
  AVAILABLE: "bg-[#e4efe5] text-[#34633b]",
  USED: "bg-[#ece8e2] text-[#655d55]",
  EXPIRED: "bg-[#f5e3df] text-[#8d3d30]",
};

export function CouponStatusBadge({ status }: { status: CouponStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-extrabold ${STATUS_CLASSES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
