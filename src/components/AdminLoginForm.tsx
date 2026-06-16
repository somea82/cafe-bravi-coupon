"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type LoginResponse = {
  message?: string;
};

export function AdminLoginForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isPending) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    setIsPending(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });
      const result = (await response.json()) as LoginResponse;

      if (!response.ok) {
        throw new Error(result.message ?? "로그인할 수 없습니다.");
      }

      router.replace("/admin/coupons");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "로그인할 수 없습니다.",
      );
      setIsPending(false);
    }
  }

  return (
    <form
      className="mt-8 grid gap-5 rounded-3xl border border-[#ded4c6] bg-[#fffdf8] p-6 shadow-[0_16px_50px_rgb(70_45_28_/_8%)]"
      onSubmit={handleSubmit}
    >
      <div>
        <label className="text-sm font-bold" htmlFor="email">
          직원 이메일
        </label>
        <input
          autoComplete="username"
          className="mt-2 min-h-12 w-full rounded-xl border border-[#cfc1af] bg-white px-4 outline-none transition focus:border-[#6f3d24] focus:ring-2 focus:ring-[#6f3d24]/10"
          id="email"
          name="email"
          required
          type="email"
        />
      </div>
      <div>
        <label className="text-sm font-bold" htmlFor="password">
          비밀번호
        </label>
        <input
          autoComplete="current-password"
          className="mt-2 min-h-12 w-full rounded-xl border border-[#cfc1af] bg-white px-4 outline-none transition focus:border-[#6f3d24] focus:ring-2 focus:ring-[#6f3d24]/10"
          id="password"
          name="password"
          required
          type="password"
        />
      </div>
      <button
        className="min-h-12 rounded-xl bg-[#6f3d24] px-5 font-bold text-white transition hover:bg-[#5d321e] disabled:cursor-wait disabled:opacity-70"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "로그인 중..." : "직원 로그인"}
      </button>
      {errorMessage ? (
        <p className="text-center text-sm text-[#a23c2b]" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </form>
  );
}
