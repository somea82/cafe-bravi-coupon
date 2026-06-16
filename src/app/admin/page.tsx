import Link from "next/link";

import { AdminHeader } from "@/components/AdminHeader";
import { requireStaffUser } from "@/lib/auth/staffAuth";
import { getDashboardStats } from "@/lib/admin/getDashboardStats";

const numberFormatter = new Intl.NumberFormat("ko-KR");
const percentFormatter = new Intl.NumberFormat("ko-KR", {
  maximumFractionDigits: 1,
});
const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

type StatCardProps = {
  label: string;
  value: string;
  caption: string;
};

function StatCard({ label, value, caption }: StatCardProps) {
  return (
    <div className="rounded-3xl border border-[#ded4c6] bg-[#fffdf8] p-5 shadow-[0_16px_50px_rgb(70_45_28_/_8%)]">
      <p className="text-xs font-extrabold tracking-[0.14em] text-[#9b8068]">
        {label}
      </p>
      <strong className="mt-3 block text-3xl tracking-[-0.05em] text-[#4e2918]">
        {value}
      </strong>
      <p className="mt-2 text-sm leading-6 text-[#746b60]">{caption}</p>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const staff = await requireStaffUser();
  const stats = await getDashboardStats();

  if (!stats) {
    return (
      <section className="mx-auto w-full max-w-3xl py-8">
        <AdminHeader email={staff.email} />
        <h1 className="text-3xl font-bold">대시보드를 불러올 수 없습니다.</h1>
      </section>
    );
  }

  const endsAt = stats.campaign.endsAt
    ? dateFormatter.format(new Date(stats.campaign.endsAt))
    : "상시";

  return (
    <section className="mx-auto w-full max-w-3xl py-8">
      <AdminHeader email={staff.email} />
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold tracking-[0.16em] text-[#6f3d24]">
            DASHBOARD
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em]">
            이벤트 대시보드
          </h1>
          <p className="mt-4 leading-7 text-[#746b60]">
            {stats.campaign.storeName} · 음료 {stats.campaign.discountPercent}%
            할인 · 종료일 {endsAt}
          </p>
        </div>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[#6f3d24] px-5 text-sm font-bold text-white"
          href="/admin/coupons"
        >
          쿠폰 조회하기
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <StatCard
          caption={`오늘 QR 진입 ${numberFormatter.format(stats.qr.todayEntries)}건`}
          label="QR 참여"
          value={`${numberFormatter.format(stats.qr.uniqueVisitors)}명`}
        />
        <StatCard
          caption={`총 QR 진입 ${numberFormatter.format(stats.qr.totalEntries)}건`}
          label="쿠폰 발급"
          value={`${numberFormatter.format(stats.coupons.issued)}건`}
        />
        <StatCard
          caption={`오늘 사용 ${numberFormatter.format(stats.coupons.todayRedeemed)}건`}
          label="쿠폰 사용"
          value={`${numberFormatter.format(stats.coupons.redeemed)}건`}
        />
        <StatCard
          caption={`발급 대비 사용률 ${percentFormatter.format(stats.rates.redeemRate)}%`}
          label="방문 전환율"
          value={`${percentFormatter.format(stats.rates.visitConversionRate)}%`}
        />
      </div>

      <div className="mt-8 rounded-3xl border border-[#ded4c6] bg-[#fffdf8] p-6 shadow-[0_16px_50px_rgb(70_45_28_/_8%)]">
        <h2 className="text-xl font-bold tracking-[-0.03em]">쿠폰 상태</h2>
        <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-3">
          <div className="rounded-2xl bg-[#f5efe6] p-4">
            <dt className="text-[#746b60]">사용 가능</dt>
            <dd className="mt-2 text-2xl font-bold text-[#4e2918]">
              {numberFormatter.format(stats.coupons.available)}
            </dd>
          </div>
          <div className="rounded-2xl bg-[#f5efe6] p-4">
            <dt className="text-[#746b60]">사용 완료</dt>
            <dd className="mt-2 text-2xl font-bold text-[#4e2918]">
              {numberFormatter.format(stats.coupons.redeemed)}
            </dd>
          </div>
          <div className="rounded-2xl bg-[#f5efe6] p-4">
            <dt className="text-[#746b60]">만료</dt>
            <dd className="mt-2 text-2xl font-bold text-[#4e2918]">
              {numberFormatter.format(stats.coupons.expired)}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 rounded-2xl bg-[#eee5d9] px-5 py-4 text-sm leading-6 text-[#5d5248]">
        방문 전환율은 <strong>쿠폰 사용 수 / QR 고유 방문자 수</strong> 기준입니다.
        실제 매장 할인 처리 후 직원이 사용 처리한 쿠폰만 방문으로 집계합니다.
      </div>
    </section>
  );
}
