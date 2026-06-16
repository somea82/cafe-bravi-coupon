"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

export function CurrentTime() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const updateTime = () => setNow(new Date());
    const initialTimer = window.setTimeout(updateTime, 0);
    const intervalTimer = window.setInterval(updateTime, 1000);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(intervalTimer);
    };
  }, []);

  return (
    <p className="text-center text-xs tabular-nums text-[#746b60]">
      현재 시각 {now ? formatter.format(now) : "확인 중..."}
    </p>
  );
}
