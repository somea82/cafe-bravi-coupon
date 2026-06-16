export default function Home() {
  return (
    <section className="setup-page">
      <div className="eyebrow">BRAVI COUPON MVP</div>
      <h1>프로젝트의 기본 골격을 준비하고 있습니다.</h1>
      <p className="lead">
        QR 진입부터 쿠폰 발급과 직원 사용 처리까지, 실제 매장에서 필요한
        흐름을 한 프로젝트 안에 구성합니다.
      </p>

      <div className="setup-card">
        <div className="setup-card-heading">
          <span>STEP 01</span>
          <strong>프로젝트 초기 세팅</strong>
        </div>
        <ul className="setup-list">
          <li>
            <span className="check" aria-hidden="true">
              ✓
            </span>
            Next.js App Router
          </li>
          <li>
            <span className="check" aria-hidden="true">
              ✓
            </span>
            TypeScript와 Tailwind CSS
          </li>
          <li>
            <span className="check" aria-hidden="true">
              ✓
            </span>
            모바일 중심 공통 레이아웃
          </li>
          <li>
            <span className="pending" aria-hidden="true" />
            Supabase와 Vercel 계정 연결
          </li>
        </ul>
      </div>

      <p className="next-step">
        다음 구현 대상은 데이터베이스 테이블과 초기 캠페인 데이터입니다.
      </p>
    </section>
  );
}
