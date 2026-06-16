import { cookies } from "next/headers";
import Image from "next/image";
import { notFound } from "next/navigation";

import { ClaimCouponButton } from "@/components/ClaimCouponButton";
import { getCampaignBySlug } from "@/lib/campaigns/getCampaignBySlug";
import { hasValidQrEntry } from "@/lib/campaigns/hasValidQrEntry";
import { VISITOR_COOKIE_NAME } from "@/lib/visitors/constants";

export default async function EventPage({
  params,
  searchParams,
}: PageProps<"/event/[slug]">) {
  const { slug } = await params;
  const query = await searchParams;
  const campaign = await getCampaignBySlug(slug);

  if (!campaign) {
    notFound();
  }

  const cookieStore = await cookies();
  const hasAccess = await hasValidQrEntry(
    slug,
    cookieStore.get(VISITOR_COOKIE_NAME)?.value,
  );

  if (!hasAccess) {
    return (
      <section className="mx-auto flex w-full max-w-xl flex-col justify-center py-12">
        <p className="text-xs font-extrabold tracking-[0.16em] text-[#6f3d24]">
          CAFE BRAVI
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-[-0.04em]">
          매장 QR을 통해 접속해 주세요.
        </h1>
        <p className="mt-5 leading-7 text-[#746b60]">
          이 이벤트는 카페 브라비 매장에 비치된 QR로 입장한 뒤 참여할 수
          있습니다.
        </p>
        {query.error === "invalid_qr" ? (
          <p className="mt-8 rounded-2xl border border-[#e4c9bd] bg-[#fff8f3] p-4 text-sm leading-6 text-[#7b3f2c]">
            QR 주소가 올바르지 않거나 현재 사용할 수 없습니다. 매장에 비치된
            QR을 다시 스캔해 주세요.
          </p>
        ) : null}
      </section>
    );
  }

  const store = campaign.stores;
  const eventDateParts = campaign.ends_at
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        timeZone: "Asia/Seoul",
      }).formatToParts(new Date(campaign.ends_at))
    : null;
  const eventDate = eventDateParts
    ? `~${eventDateParts.find(({ type }) => type === "year")?.value}/${
        eventDateParts.find(({ type }) => type === "month")?.value
      }/${eventDateParts.find(({ type }) => type === "day")?.value}`
    : "~2026/7/31";

  return (
    <div className="invitation-stage">
      <div className="invitation-stage-shade" />
      <section className="invitation-layout">
        <article className="invitation-card">
          <div className="invitation-paper">
            <p className="invitation-brand">
              CAFE
              <br />
              BRAVI
            </p>

            <div className="invitation-ribbon">
              <span aria-hidden="true">✦</span>
              <strong>브라비 방문 이벤트</strong>
              <span aria-hidden="true">✦</span>
            </div>

            <h1>
              저희 제품을 사랑해주시는 분들께
              <br />
              특별한 초대장을 드립니다
            </h1>

            <div className="invitation-illustration">
              <Image
                alt="카페 브라비 매장으로 향하는 두 사람의 일러스트"
                fill
                priority
                sizes="(max-width: 640px) 72vw, 340px"
                src="/images/bravi-storefront-illustration.png"
              />
            </div>

            <div
              aria-hidden="true"
              className="invitation-drink invitation-drink-left"
            >
              <Image
                alt=""
                fill
                priority
                sizes="120px"
                src="/images/drink1.png.png"
              />
            </div>
            <div
              aria-hidden="true"
              className="invitation-drink invitation-drink-right"
            >
              <Image
                alt=""
                fill
                priority
                sizes="120px"
                src="/images/drink2.png.png"
              />
            </div>

            <div className="invitation-schedule">
              <p>{eventDate}</p>
              <strong>10:00 AM - 7:00 PM</strong>
            </div>

            <dl className="invitation-details">
              <div>
                <dt>INVITATION</dt>
                <dd>{store.name}</dd>
              </div>
              <div>
                <dt>VALID FOR</dt>
                <dd>발급 후 {campaign.validity_days}일</dd>
              </div>
            </dl>
          </div>

          <ClaimCouponButton
            discountPercent={campaign.discount_percent}
            slug={slug}
            variant="invitation"
          />
        </article>

        <div className="invitation-actions">
        {store.naver_url ? (
          <a
              className="invitation-map-link"
            href={store.naver_url}
            rel="noopener noreferrer"
            target="_blank"
          >
              <span aria-hidden="true">N</span>
              네이버 지도에서 카페 브라비 보기
          </a>
        ) : null}
          <p className="invitation-note">
          사용 가능한 쿠폰이 이미 있으면 기존 쿠폰을 다시 보여드립니다.
        </p>
        </div>
      </section>
      </div>
  );
}
