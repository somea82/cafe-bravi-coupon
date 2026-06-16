import Link from "next/link";

import { AdminLogoutButton } from "@/components/AdminLogoutButton";

export function AdminHeader({ email }: { email: string | undefined }) {
  return (
    <div className="mb-8 flex items-center justify-between gap-4 border-b border-[#ded4c6] pb-5">
      <div>
        <Link
          className="text-sm font-extrabold tracking-[0.08em] text-[#6f3d24]"
          href="/admin"
        >
          BRAVI STAFF
        </Link>
        <p className="mt-1 text-xs text-[#746b60]">{email ?? "직원 계정"}</p>
      </div>
      <div className="flex items-center gap-3">
        <Link
          className="text-xs font-bold text-[#6f3d24] underline underline-offset-4"
          href="/admin/coupons"
        >
          쿠폰 조회
        </Link>
        <AdminLogoutButton />
      </div>
    </div>
  );
}
