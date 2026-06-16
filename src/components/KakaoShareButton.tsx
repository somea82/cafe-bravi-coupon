"use client";

import Script from "next/script";
import { useState } from "react";

type KakaoShareButtonProps = {
  couponCode: string;
  couponUrl: string;
  discountPercent: number;
  expiresAt: string;
  javascriptKey?: string;
};

type KakaoSdk = {
  init: (key: string) => void;
  isInitialized: () => boolean;
  Share: {
    sendDefault: (settings: {
      objectType: "text";
      text: string;
      link: {
        mobileWebUrl: string;
        webUrl: string;
      };
      buttonTitle: string;
    }) => void;
  };
};

declare global {
  interface Window {
    Kakao?: KakaoSdk;
  }
}

export function KakaoShareButton({
  couponCode,
  couponUrl,
  discountPercent,
  expiresAt,
  javascriptKey,
}: KakaoShareButtonProps) {
  const [sdkReady, setSdkReady] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const shareText = [
    `카페 브라비 ${discountPercent}% 할인 쿠폰이 발급되었습니다.`,
    `쿠폰번호: ${couponCode}`,
    `사용기한: ${expiresAt}까지`,
    "방문 시 직원에게 쿠폰 화면을 보여주세요.",
  ].join("\n");
  const clipboardText = [
    shareText,
    "",
    "쿠폰 확인하기:",
    couponUrl,
  ].join("\n");

  function initializeKakao() {
    if (!javascriptKey || !window.Kakao) {
      return;
    }

    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(javascriptKey);
    }

    setSdkReady(true);
  }

  async function copyCouponDetails() {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(clipboardText);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = clipboardText;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();

    if (!copied) {
      throw new Error("클립보드 복사에 실패했습니다.");
    }
  }

  async function shareCoupon() {
    setMessage(null);
    const copyPromise = copyCouponDetails();

    try {
      if (javascriptKey && sdkReady && window.Kakao) {
        window.Kakao.Share.sendDefault({
          objectType: "text",
          text: shareText,
          link: {
            mobileWebUrl: couponUrl,
            webUrl: couponUrl,
          },
          buttonTitle: "쿠폰 확인하기",
        });
        await copyPromise;
        setMessage(
          "쿠폰번호와 링크를 복사했습니다. 카카오톡에서 '나와의 채팅'을 선택해 저장하세요.",
        );
        return;
      }

      if (navigator.share) {
        const [copyResult, shareResult] = await Promise.allSettled([
          copyPromise,
          navigator.share({
            title: `카페 브라비 ${discountPercent}% 할인 쿠폰`,
            text: shareText,
            url: couponUrl,
          }),
        ]);

        if (copyResult.status === "rejected") {
          throw copyResult.reason;
        }

        if (
          shareResult.status === "rejected" &&
          shareResult.reason instanceof DOMException &&
          shareResult.reason.name !== "AbortError"
        ) {
          throw shareResult.reason;
        }

        setMessage(
          "쿠폰번호와 링크를 복사했습니다. 카카오톡 '나와의 채팅'에 붙여넣어 저장할 수 있습니다.",
        );
        return;
      }

      await copyPromise;
      setMessage(
        "쿠폰번호와 링크를 복사했습니다. 카카오톡 '나와의 채팅'에 붙여넣어 주세요.",
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      setMessage("공유창을 열 수 없습니다. 쿠폰 링크 복사를 이용해 주세요.");
    }
  }

  return (
    <>
      {javascriptKey ? (
        <Script
          onError={() => setSdkReady(false)}
          onReady={initializeKakao}
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.8.1/kakao.min.js"
          strategy="afterInteractive"
        />
      ) : null}
      <button
        className="flex min-h-12 w-full items-center justify-center rounded-2xl bg-[#fee500] px-5 text-sm font-bold text-[#191919] transition hover:bg-[#f4dc00]"
        onClick={shareCoupon}
        type="button"
      >
        카카오톡으로 저장하기
      </button>
      {message ? (
        <p className="mt-2 text-center text-xs leading-5 text-[#746b60]">
          {message}
        </p>
      ) : null}
    </>
  );
}
