"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { normalizeCouponCode } from "@/lib/coupons/normalizeCouponCode";

export function CouponSearchForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const code = normalizeCouponCode(String(formData.get("code") ?? ""));

    if (!code) {
      setErrorMessage("쿠폰번호를 확인해 주세요. 예: BRAVI-8F2A9");
      return;
    }

    setErrorMessage(null);
    router.push(`/admin/coupons/${encodeURIComponent(code)}`);
  }

  return (
    <form
      className="mt-8 rounded-3xl border border-[#ded4c6] bg-[#fffdf8] p-6 shadow-[0_16px_50px_rgb(70_45_28_/_8%)]"
      onSubmit={handleSubmit}
    >
      <label className="text-sm font-bold" htmlFor="code">
        쿠폰번호
      </label>
      <div className="mt-2 grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          autoCapitalize="characters"
          autoComplete="off"
          className="min-h-12 min-w-0 rounded-xl border border-[#cfc1af] bg-white px-4 font-mono uppercase tracking-[0.06em] outline-none transition focus:border-[#6f3d24] focus:ring-2 focus:ring-[#6f3d24]/10"
          id="code"
          name="code"
          placeholder="BRAVI-8F2A9"
          required
        />
        <button
          className="min-h-12 rounded-xl bg-[#6f3d24] px-6 font-bold text-white transition hover:bg-[#5d321e]"
          type="submit"
        >
          조회하기
        </button>
      </div>
      {errorMessage ? (
        <p className="mt-3 text-sm text-[#a23c2b]" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </form>
  );
}
