"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLogoutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function logout() {
    setIsPending(true);
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      className="text-xs font-bold text-[#746b60] underline underline-offset-4 disabled:opacity-60"
      disabled={isPending}
      onClick={logout}
      type="button"
    >
      {isPending ? "로그아웃 중..." : "로그아웃"}
    </button>
  );
}
