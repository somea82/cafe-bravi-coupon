create extension if not exists pgcrypto with schema extensions;

create type public.coupon_event_action as enum (
  'ISSUED',
  'VIEWED',
  'SHARED',
  'REDEEMED',
  'EXPIRED_VIEWED'
);

create table public.stores (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  naver_url text,
  kakao_url text,
  google_url text,
  created_at timestamptz not null default now(),
  constraint stores_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete restrict,
  slug text not null unique,
  title text not null,
  discount_percent smallint not null,
  validity_days smallint not null,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  constraint campaigns_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint campaigns_discount_range check (
    discount_percent between 1 and 100
  ),
  constraint campaigns_validity_days_positive check (validity_days > 0),
  constraint campaigns_date_order check (
    starts_at is null or ends_at is null or starts_at < ends_at
  )
);

create index campaigns_store_id_idx on public.campaigns(store_id);

create table public.qr_tokens (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  token_hash text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint qr_tokens_hash_format check (token_hash ~ '^[0-9a-f]{64}$')
);

create index qr_tokens_campaign_id_idx on public.qr_tokens(campaign_id);

create table public.visitors (
  id uuid primary key default gen_random_uuid(),
  visitor_key_hash text not null unique,
  created_at timestamptz not null default now(),
  constraint visitors_key_hash_format check (
    visitor_key_hash ~ '^[0-9a-f]{64}$'
  )
);

create table public.qr_entries (
  id uuid primary key default gen_random_uuid(),
  visitor_id uuid not null references public.visitors(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  verified_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '30 minutes'),
  created_at timestamptz not null default now(),
  constraint qr_entries_expiry_after_verification check (
    expires_at > verified_at
  )
);

create index qr_entries_access_idx
  on public.qr_entries(visitor_id, campaign_id, expires_at desc);

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete restrict,
  visitor_id uuid not null references public.visitors(id) on delete restrict,
  code text not null unique,
  access_token_hash text not null unique,
  issued_at timestamptz not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  used_by uuid references auth.users(id) on delete set null,
  claim_slot_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint coupons_code_format check (
    code ~ '^BRAVI-[A-Z0-9]{5,12}$'
  ),
  constraint coupons_access_token_hash_format check (
    access_token_hash ~ '^[0-9a-f]{64}$'
  ),
  constraint coupons_expiry_after_issue check (expires_at > issued_at),
  constraint coupons_usage_after_issue check (
    used_at is null or used_at >= issued_at
  )
);

create unique index coupons_one_claim_slot_per_visitor_idx
  on public.coupons(campaign_id, visitor_id)
  where claim_slot_active;

create index coupons_customer_lookup_idx
  on public.coupons(visitor_id, campaign_id, expires_at desc);

create table public.coupon_events (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid not null references public.coupons(id) on delete cascade,
  action public.coupon_event_action not null,
  staff_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index coupon_events_coupon_id_created_at_idx
  on public.coupon_events(coupon_id, created_at desc);

alter table public.stores enable row level security;
alter table public.campaigns enable row level security;
alter table public.qr_tokens enable row level security;
alter table public.visitors enable row level security;
alter table public.qr_entries enable row level security;
alter table public.coupons enable row level security;
alter table public.coupon_events enable row level security;

revoke all on table public.stores from anon, authenticated;
revoke all on table public.campaigns from anon, authenticated;
revoke all on table public.qr_tokens from anon, authenticated;
revoke all on table public.visitors from anon, authenticated;
revoke all on table public.qr_entries from anon, authenticated;
revoke all on table public.coupons from anon, authenticated;
revoke all on table public.coupon_events from anon, authenticated;

grant all on table public.stores to service_role;
grant all on table public.campaigns to service_role;
grant all on table public.qr_tokens to service_role;
grant all on table public.visitors to service_role;
grant all on table public.qr_entries to service_role;
grant all on table public.coupons to service_role;
grant all on table public.coupon_events to service_role;

create or replace function public.verify_qr_token(
  p_campaign_slug text,
  p_token_hash text
)
returns table (
  campaign_id uuid,
  campaign_slug text
)
language sql
security definer
set search_path = ''
as $$
  select c.id, c.slug
  from public.campaigns c
  join public.qr_tokens qt on qt.campaign_id = c.id
  where c.slug = p_campaign_slug
    and c.is_active
    and (c.starts_at is null or c.starts_at <= now())
    and (c.ends_at is null or c.ends_at > now())
    and qt.token_hash = p_token_hash
    and qt.is_active
  limit 1;
$$;

create or replace function public.record_qr_entry(
  p_campaign_id uuid,
  p_visitor_id uuid
)
returns public.qr_entries
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_entry public.qr_entries;
begin
  insert into public.qr_entries (campaign_id, visitor_id)
  values (p_campaign_id, p_visitor_id)
  returning * into v_entry;

  return v_entry;
end;
$$;

create or replace function public.has_valid_qr_entry(
  p_campaign_slug text,
  p_visitor_key_hash text
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.qr_entries qe
    join public.visitors v on v.id = qe.visitor_id
    join public.campaigns c on c.id = qe.campaign_id
    where c.slug = p_campaign_slug
      and c.is_active
      and (c.starts_at is null or c.starts_at <= now())
      and (c.ends_at is null or c.ends_at > now())
      and v.visitor_key_hash = p_visitor_key_hash
      and qe.expires_at > now()
  );
$$;

create or replace function public.claim_coupon(
  p_campaign_id uuid,
  p_visitor_id uuid,
  p_code text,
  p_access_token_hash text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_campaign public.campaigns;
  v_coupon public.coupons;
begin
  select *
  into v_campaign
  from public.campaigns
  where id = p_campaign_id
    and is_active
    and (starts_at is null or starts_at <= now())
    and (ends_at is null or ends_at > now());

  if not found then
    raise exception 'CAMPAIGN_NOT_ACTIVE';
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended(p_campaign_id::text || ':' || p_visitor_id::text, 0)
  );

  select *
  into v_coupon
  from public.coupons
  where campaign_id = p_campaign_id
    and visitor_id = p_visitor_id
    and claim_slot_active
    and used_at is null
    and expires_at > now()
  order by issued_at desc
  limit 1
  for update;

  if found then
    update public.coupons
    set access_token_hash = p_access_token_hash
    where id = v_coupon.id
    returning * into v_coupon;

    return jsonb_build_object(
      'created', false,
      'coupon', to_jsonb(v_coupon)
    );
  end if;

  update public.coupons
  set claim_slot_active = false
  where campaign_id = p_campaign_id
    and visitor_id = p_visitor_id
    and claim_slot_active;

  insert into public.coupons (
    campaign_id,
    visitor_id,
    code,
    access_token_hash,
    issued_at,
    expires_at
  )
  values (
    p_campaign_id,
    p_visitor_id,
    p_code,
    p_access_token_hash,
    now(),
    now() + make_interval(days => v_campaign.validity_days)
  )
  returning * into v_coupon;

  insert into public.coupon_events (coupon_id, action)
  values (v_coupon.id, 'ISSUED');

  return jsonb_build_object(
    'created', true,
    'coupon', to_jsonb(v_coupon)
  );
end;
$$;

create or replace function public.redeem_coupon(
  p_code text,
  p_staff_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_coupon public.coupons;
begin
  update public.coupons
  set
    used_at = now(),
    used_by = p_staff_id,
    claim_slot_active = false
  where code = p_code
    and used_at is null
    and expires_at > now()
  returning * into v_coupon;

  if not found then
    return null;
  end if;

  insert into public.coupon_events (coupon_id, action, staff_id)
  values (v_coupon.id, 'REDEEMED', p_staff_id);

  return to_jsonb(v_coupon);
end;
$$;

revoke all on function public.verify_qr_token(text, text)
  from public, anon, authenticated;
revoke all on function public.record_qr_entry(uuid, uuid)
  from public, anon, authenticated;
revoke all on function public.has_valid_qr_entry(text, text)
  from public, anon, authenticated;
revoke all on function public.claim_coupon(uuid, uuid, text, text)
  from public, anon, authenticated;
revoke all on function public.redeem_coupon(text, uuid)
  from public, anon, authenticated;

grant execute on function public.verify_qr_token(text, text)
  to service_role;
grant execute on function public.record_qr_entry(uuid, uuid)
  to service_role;
grant execute on function public.has_valid_qr_entry(text, text)
  to service_role;
grant execute on function public.claim_coupon(uuid, uuid, text, text)
  to service_role;
grant execute on function public.redeem_coupon(text, uuid)
  to service_role;
