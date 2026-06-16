const KOREAN_DATE_TIME_FORMATTER = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function formatCouponDate(value: string | Date) {
  return KOREAN_DATE_TIME_FORMATTER.format(
    typeof value === "string" ? new Date(value) : value,
  );
}
