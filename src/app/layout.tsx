import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "카페 브라비",
    template: "%s | 카페 브라비",
  },
  description: "카페 브라비 리뷰 이벤트 쿠폰",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <div className="app-shell">
          <header className="app-header">
            <span className="brand-mark" aria-hidden="true">
              B
            </span>
            <span className="brand-name">CAFE BRAVI</span>
          </header>
          <main className="app-content">{children}</main>
          <footer className="app-footer">
            <p>카페 브라비 리뷰 이벤트</p>
            <p>쿠폰 상태는 서버 기록을 기준으로 확인합니다.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
