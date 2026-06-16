"use client";

import { useState } from "react";

type CopyCouponLinkButtonProps = {
  couponUrl: string;
};

export function CopyCouponLinkButton({
  couponUrl,
}: CopyCouponLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(couponUrl);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = couponUrl;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      className="flex min-h-12 w-full items-center justify-center rounded-2xl border border-[#6f3d24] bg-white px-5 text-sm font-bold text-[#6f3d24] transition hover:bg-[#fbf4ed]"
      onClick={copyLink}
      type="button"
    >
      {copied ? "쿠폰 링크를 복사했습니다" : "쿠폰 링크 복사하기"}
    </button>
  );
}
