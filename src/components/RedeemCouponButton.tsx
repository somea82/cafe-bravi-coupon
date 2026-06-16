"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type RedeemResponse = {
  message?: string;
};

export function RedeemCouponButton({ code }: { code: string }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function redeemCoupon() {
    if (isPending) {
      return;
    }

    const confirmed = window.confirm(
      `${code} 쿠폰을 사용 완료 처리하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
    );

    if (!confirmed) {
      return;
    }

    setIsPending(true);
    setMessage(null);

    try {
      const response = await fetch(
        `/api/admin/coupons/${encodeURIComponent(code)}/redeem`,
        { method: "POST" },
      );
      const result = (await response.json()) as RedeemResponse;

      if (!response.ok) {
        throw new Error(
          result.message ?? "쿠폰을 사용 처리할 수 없습니다.",
        );
      }

      setMessage("쿠폰 사용 처리가 완료되었습니다.");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "쿠폰을 사용 처리할 수 없습니다.",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div>
      <button
        className="min-h-14 w-full rounded-2xl bg-[#6f3d24] px-6 font-bold text-white transition hover:bg-[#5d321e] disabled:cursor-wait disabled:opacity-70"
        disabled={isPending}
        onClick={redeemCoupon}
        type="button"
      >
        {isPending ? "사용 처리 중..." : "사용 처리하기"}
      </button>
      {message ? (
        <p className="mt-3 text-center text-sm leading-6 text-[#746b60]">
          {message}
        </p>
      ) : null}
    </div>
  );
}
