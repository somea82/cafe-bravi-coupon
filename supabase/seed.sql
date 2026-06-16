insert into public.stores (
  slug,
  name,
  naver_url,
  kakao_url,
  google_url
)
values (
  'bravi',
  '카페 브라비',
  'https://map.naver.com/p/entry/place/1046999902?c=15.00,0,0,0,dh&placePath=/home?from=map&fromPanelNum=1&additionalHeight=76&timestamp=202606141654&locale=ko&svcName=map_pcv5',
  null,
  null
)
on conflict (slug) do update
set
  name = excluded.name,
  naver_url = excluded.naver_url,
  kakao_url = excluded.kakao_url,
  google_url = excluded.google_url;

insert into public.campaigns (
  store_id,
  slug,
  title,
  discount_percent,
  validity_days,
  starts_at,
  ends_at,
  is_active
)
select
  s.id,
  'bravi',
  '카페 브라비 리뷰 이벤트',
  20,
  7,
  now(),
  '2026-07-31 23:59:59+09',
  true
from public.stores s
where s.slug = 'bravi'
on conflict (slug) do update
set
  store_id = excluded.store_id,
  title = excluded.title,
  discount_percent = excluded.discount_percent,
  validity_days = excluded.validity_days,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  is_active = excluded.is_active;

insert into public.qr_tokens (
  campaign_id,
  token_hash,
  is_active
)
select
  c.id,
  '75d58a59b9afc55c8b2ba00dbd5425af53f29900cdf9ffcd49ed6b1c71656c5e',
  true
from public.campaigns c
where c.slug = 'bravi'
on conflict (token_hash) do update
set
  campaign_id = excluded.campaign_id,
  is_active = excluded.is_active;
