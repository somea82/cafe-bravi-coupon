# Cafe Bravi QR Coupon Event<table>
  <tr>
    <td>
      <img
        src="https://github.com/user-attachments/assets/44436589-fffb-4692-bb88-4713a7fdc3d1"
        alt="Image 1"
        width="360"
      />
    </td>
    <td>
      <img
        src="https://github.com/user-attachments/assets/046020e1-f72a-49eb-ac87-e97aa42f11b7"
        alt="Image 2"
        width="360"
      />
    </td>
  </tr>
</table>

카페 브라비 방문 전환을 목표로 만든 QR 기반 쿠폰 발급 서비스입니다.

납품 제품에 대한 만족도는 높았지만 실제 매장 방문으로 이어지지 않는 문제가 있었고, 이를 해결하기 위해 오프라인 QR 진입부터 쿠폰 발급, 직원 사용 처리, 관리자 통계 확인까지 이어지는 작은 이벤트 시스템을 구축했습니다.

## 배경

- 카페 제품 납품 고객의 만족도는 높았지만 매장 방문 전환이 부족
- 일주일 납품량 약 100개 수준에서 10%의 실제 방문 전환을 1차 KPI로 설정
- QR 스캔으로 이벤트 페이지에 진입하고, 음료 20% 할인 쿠폰을 발급받아 방문 시 사용하는 흐름 설계

## 결과

- Vercel 통계 기준 QR 참여율 40% 이상
- 쿠폰 사용량 기준 실제 고객 전환률 약 10%
- 직원이 별도 앱 설치 없이 웹 관리자 화면에서 쿠폰 조회/사용 처리 가능
- 쿠폰 중복 발급, 중복 사용, 만료 처리 자동화
- 운영자가 직접 확인 가능한 관리자 대시보드 구축

## 주요 기능

### 사용자

- QR 코드 진입
- 브라비 방문 이벤트 페이지 확인
- 음료 20% 할인 쿠폰 발급
- 사용 가능한 기존 쿠폰이 있으면 신규 발급 대신 기존 쿠폰 표시
- 쿠폰번호, 발급일, 만료일, 상태 확인
- 쿠폰 링크 복사 및 카카오톡 공유
- 네이버 지도 연결

### 직원/관리자

- Supabase Auth 기반 직원 로그인
- 쿠폰번호 검색
- 쿠폰 상태 확인
- 사용 가능 쿠폰 사용 처리
- 이미 사용된 쿠폰/만료 쿠폰 예외 처리
- QR 진입, 쿠폰 발급, 쿠폰 사용 현황 대시보드 확인

## 기술 스택

| 영역 | 기술 |
| --- | --- |
| Frontend | Next.js App Router, React, TypeScript |
| Backend | Next.js Route Handler |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| Deployment | Vercel |
| Styling | CSS |
| Analytics | Vercel Analytics |

## 기술 선정 이유

### Next.js App Router

이벤트 페이지, 쿠폰 페이지, 관리자 페이지, API Route를 하나의 프로젝트 안에서 구성할 수 있어 MVP 개발 속도를 높일 수 있었습니다. 별도 백엔드 서버 없이 Route Handler로 QR 검증, 쿠폰 발급, 사용 처리 API를 구현했습니다.

### Supabase

쿠폰 발급 기록, QR 진입 기록, 방문자 정보, 직원 인증 정보를 저장해야 했기 때문에 PostgreSQL 기반의 관리형 DB가 필요했습니다. Supabase는 DB와 Auth를 함께 제공해 초기 구축과 운영 복잡도를 줄일 수 있었습니다.

### Vercel

Next.js 배포와 운영에 적합하고, QR 이벤트처럼 빠른 디자인 수정과 기능 배포가 필요한 프로젝트에 잘 맞았습니다. 실제 운영 중에도 화면 개선과 관리자 기능 추가를 빠르게 반영했습니다.

## 서비스 흐름

```text
사용자 QR 스캔
→ /q/[slug] 진입
→ QR token 검증
→ visitor 쿠키 발급
→ QR 진입 기록 저장
→ /event/[slug] 이동
→ 쿠폰 발급 요청
→ 기존 사용 가능 쿠폰 확인
→ 없으면 신규 쿠폰 생성
→ /coupon/[accessToken] 이동
→ 직원이 쿠폰번호 조회
→ 사용 가능 여부 확인
→ 사용 처리
```

## DB 설계

주요 테이블:

- `stores`
- `campaigns`
- `qr_tokens`
- `visitors`
- `qr_entries`
- `coupons`
- `coupon_events`

쿠폰 발급과 사용 처리는 서버와 DB 기준으로 처리했습니다. 프론트엔드 버튼 비활성화만으로 중복 발급을 막지 않고, 서버에서 기존 사용 가능 쿠폰을 조회한 뒤 신규 발급 여부를 결정하도록 구성했습니다.

## 쿠폰 정책

- QR 진입 기록이 있는 사용자만 쿠폰 발급 가능
- 같은 기기에서 사용 가능한 쿠폰이 이미 있으면 기존 쿠폰 반환
- 쿠폰 발급일과 만료일은 서버 기준으로 저장
- 쿠폰 사용/만료 후에는 새 쿠폰 발급 가능
- 쿠폰 상태는 `사용 가능`, `사용 완료`, `만료`로 구분

직원 사용 처리는 조건부 업데이트로 처리해 같은 쿠폰을 두 직원이 동시에 처리해도 한 번만 성공하도록 설계했습니다.

```sql
UPDATE coupons
SET used_at = now()
WHERE code = $code
  AND used_at IS NULL
  AND expires_at > now()
RETURNING *;
```

## 프로젝트 구조

```text
src/app
├── q/[slug]                 # QR 진입 route
├── event/[slug]             # 이벤트 안내 및 쿠폰 발급
├── coupon/[accessToken]     # 고객 쿠폰 페이지
├── admin                    # 관리자 대시보드
└── api                      # 쿠폰 발급/사용 처리 API

src/lib
├── campaigns                # QR 진입, 캠페인 조회
├── coupons                  # 쿠폰 생성, 조회, 상태 계산, 사용 처리
├── visitors                 # 방문자 쿠키 및 visitor 생성
├── auth                     # 직원 인증
└── supabase                 # Supabase client
```

## 담당 업무

- QR 기반 이벤트 진입 플로우 설계
- Supabase DB 스키마 설계 및 마이그레이션
- 쿠폰 발급/중복 방지 로직 구현
- 쿠폰 상태 계산 및 조건부 사용 처리 구현
- 직원 관리자 페이지 및 로그인 기능 구현
- 관리자 대시보드 통계 구현
- 모바일 중심 이벤트/쿠폰 화면 UI 디자인
- Vercel 배포 및 운영 환경 설정

## 로컬 실행

```bash
npm install
cp .env.example .env.local
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

## 환경 변수

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public | 쿠폰 링크의 기준 URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public | 브라우저용 Supabase 키 |
| `SUPABASE_SECRET_KEY` | Server | 서버 전용 Supabase 작업 |
| `NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY` | Public | 카카오 공유 SDK |
| `QR_TOKEN_SECRET` | Server | QR 진입 토큰 해시 |
| `COOKIE_SECRET` | Server | 방문자 쿠키 서명 |
| `COUPON_TOKEN_SECRET` | Server | 쿠폰 접근 토큰 생성 |
| `BRAVI_QR_TOKEN` | Local only | 인쇄용 QR 생성에 사용하는 원본 토큰 |

`SUPABASE_SECRET_KEY`, `QR_TOKEN_SECRET`, `COOKIE_SECRET`, `COUPON_TOKEN_SECRET`, `BRAVI_QR_TOKEN`은 클라이언트 코드에서 접근하지 않습니다.

## QR 생성

실제 QR에는 다음 형식의 URL을 사용합니다.

```text
https://cafeevnet.vercel.app/q/bravi?t={BRAVI_QR_TOKEN}
```

인쇄용 PNG와 SVG QR 파일은 다음 명령으로 생성합니다.

```bash
npm run qr:generate
```

생성 파일은 `qr-output/`에 저장됩니다. QR에는 비공개 진입 토큰이 포함되므로 이 디렉터리는 Git에 커밋하지 않습니다.

## 배운 점

단순한 이벤트 페이지도 실제 운영에서는 중복 발급, 쿠폰 만료, 직원 사용 처리, 관리자 인증, QR 공유 가능성 등 여러 예외 상황을 고려해야 했습니다.

특히 QR은 결국 URL이기 때문에 완벽한 공유 차단보다 운영 목적에 맞게 악용 비용을 높이는 방향이 현실적이라고 판단했습니다.

## 향후 개선 사항

- 포스기 전용 `/admin/pos` 화면 추가
- 쿠폰 확인용 QR 또는 짧은 확인코드 추가
- 카카오톡 공유 기능 고도화
- 캠페인별 통계 필터링
- 여러 매장/여러 이벤트를 관리할 수 있는 구조로 확장
