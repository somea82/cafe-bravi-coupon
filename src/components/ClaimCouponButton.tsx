"use client";

import { useState } from "react";

type ClaimCouponButtonProps = {
  discountPercent: number;
  slug: string;
  variant?: "default" | "invitation";
};

type ClaimResponse = {
  couponUrl?: string;
  message?: string;
};

export function ClaimCouponButton({
  discountPercent,
  slug,
  variant = "default",
}: ClaimCouponButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [isTearing, setIsTearing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function claimCoupon() {
    if (isPending) {
      return;
    }

    setIsPending(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/campaigns/${slug}/claim`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      });
      const result = (await response.json()) as ClaimResponse;

      if (!response.ok || !result.couponUrl) {
        throw new Error(
          result.message ?? "쿠폰을 발급할 수 없습니다. QR을 다시 스캔해 주세요.",
        );
      }

      if (variant === "invitation") {
        setIsTearing(true);
        window.setTimeout(() => {
          window.location.assign(result.couponUrl!);
        }, 900);
        return;
      }

      window.location.assign(result.couponUrl);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "쿠폰 발급 중 문제가 발생했습니다.",
      );
      setIsPending(false);
    }
  }

  if (variant === "invitation") {
    return (
      <div
        className={`invitation-ticket-stub${isTearing ? " is-tearing" : ""}`}
      >
        <button
          className="invitation-claim-button"
          disabled={isPending}
          onClick={claimCoupon}
          type="button"
        >
          <span className="invitation-ticket-kicker">
            ADMIT ONE · BRAVI COUPON
          </span>
          <strong>
            {isTearing
              ? "초대장을 뜯는 중..."
              : isPending
                ? "초대장을 확인하는 중..."
                : `음료 ${discountPercent}% 할인 쿠폰 발급 받기`}
          </strong>
          {!isPending ? <span className="invitation-click">CLICK!</span> : null}
        </button>
        {errorMessage ? (
          <p className="invitation-ticket-error" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      <button
        className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#6f3d24] px-6 text-base font-bold text-white shadow-[0_10px_28px_rgb(78_41_24_/_20%)] transition hover:bg-[#5d321e] disabled:cursor-wait disabled:opacity-70"
        disabled={isPending}
        onClick={claimCoupon}
        type="button"
      >
        {isPending
          ? "쿠폰을 확인하고 있습니다..."
          : `${discountPercent}% 쿠폰 발급받기`}
      </button>
      {errorMessage ? (
        <p
          className="mt-3 text-center text-sm leading-6 text-[#a23c2b]"
          role="alert"
        >
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
