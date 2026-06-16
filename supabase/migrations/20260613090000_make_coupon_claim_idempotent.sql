drop function public.claim_coupon(uuid, uuid, text, text);

create function public.claim_coupon(
  p_campaign_id uuid,
  p_visitor_id uuid,
  p_coupon_id uuid,
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
    id,
    campaign_id,
    visitor_id,
    code,
    access_token_hash,
    issued_at,
    expires_at
  )
  values (
    p_coupon_id,
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

revoke all on function public.claim_coupon(uuid, uuid, uuid, text, text)
  from public, anon, authenticated;

grant execute on function public.claim_coupon(uuid, uuid, uuid, text, text)
  to service_role;
