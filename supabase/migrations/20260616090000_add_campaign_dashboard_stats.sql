create or replace function public.get_campaign_dashboard_stats(
  p_campaign_slug text
)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  with campaign as (
    select
      c.id,
      c.slug,
      c.title,
      c.discount_percent,
      c.starts_at,
      c.ends_at,
      c.is_active,
      s.name as store_name
    from public.campaigns c
    join public.stores s on s.id = c.store_id
    where c.slug = p_campaign_slug
    limit 1
  ),
  today as (
    select date_trunc('day', now() at time zone 'Asia/Seoul') at time zone 'Asia/Seoul' as starts_at
  ),
  qr_stats as (
    select
      count(qe.id)::integer as total_entries,
      count(distinct qe.visitor_id)::integer as unique_visitors,
      count(qe.id) filter (where qe.created_at >= today.starts_at)::integer as today_entries
    from campaign c
    cross join today
    left join public.qr_entries qe on qe.campaign_id = c.id
  ),
  coupon_stats as (
    select
      count(cp.id)::integer as issued,
      count(cp.id) filter (where cp.used_at is not null)::integer as redeemed,
      count(cp.id) filter (
        where cp.used_at is null and cp.expires_at > now()
      )::integer as available,
      count(cp.id) filter (
        where cp.used_at is null and cp.expires_at <= now()
      )::integer as expired,
      count(cp.id) filter (where cp.created_at >= today.starts_at)::integer as today_issued,
      count(cp.id) filter (where cp.used_at >= today.starts_at)::integer as today_redeemed
    from campaign c
    cross join today
    left join public.coupons cp on cp.campaign_id = c.id
  )
  select jsonb_build_object(
    'campaign', jsonb_build_object(
      'slug', campaign.slug,
      'title', campaign.title,
      'storeName', campaign.store_name,
      'discountPercent', campaign.discount_percent,
      'startsAt', campaign.starts_at,
      'endsAt', campaign.ends_at,
      'isActive', campaign.is_active
    ),
    'qr', jsonb_build_object(
      'totalEntries', coalesce(qr_stats.total_entries, 0),
      'uniqueVisitors', coalesce(qr_stats.unique_visitors, 0),
      'todayEntries', coalesce(qr_stats.today_entries, 0)
    ),
    'coupons', jsonb_build_object(
      'issued', coalesce(coupon_stats.issued, 0),
      'redeemed', coalesce(coupon_stats.redeemed, 0),
      'available', coalesce(coupon_stats.available, 0),
      'expired', coalesce(coupon_stats.expired, 0),
      'todayIssued', coalesce(coupon_stats.today_issued, 0),
      'todayRedeemed', coalesce(coupon_stats.today_redeemed, 0)
    ),
    'rates', jsonb_build_object(
      'claimRate',
        case
          when coalesce(qr_stats.unique_visitors, 0) = 0 then 0
          else round((coupon_stats.issued::numeric / qr_stats.unique_visitors::numeric) * 100, 1)
        end,
      'redeemRate',
        case
          when coalesce(coupon_stats.issued, 0) = 0 then 0
          else round((coupon_stats.redeemed::numeric / coupon_stats.issued::numeric) * 100, 1)
        end,
      'visitConversionRate',
        case
          when coalesce(qr_stats.unique_visitors, 0) = 0 then 0
          else round((coupon_stats.redeemed::numeric / qr_stats.unique_visitors::numeric) * 100, 1)
        end
    )
  )
  from campaign
  cross join qr_stats
  cross join coupon_stats;
$$;

revoke all on function public.get_campaign_dashboard_stats(text)
  from public, anon, authenticated;

grant execute on function public.get_campaign_dashboard_stats(text)
  to service_role;
