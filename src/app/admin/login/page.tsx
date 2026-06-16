import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/AdminLoginForm";
import { getStaffUser } from "@/lib/auth/staffAuth";

export default async function AdminLoginPage() {
  const user = await getStaffUser();

  if (user) {
    redirect("/admin");
  }

  return (
    <section className="mx-auto flex w-full max-w-md flex-col justify-center py-14">
      <p className="text-xs font-extrabold tracking-[0.16em] text-[#6f3d24]">
        STAFF ONLY
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em]">
        직원 쿠폰 관리
      </h1>
      <p className="mt-4 leading-7 text-[#746b60]">
        발급받은 직원 계정으로 로그인해 쿠폰 상태를 확인하고 사용 처리합니다.
      </p>
      <AdminLoginForm />
    </section>
  );
}
