import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

export async function getCampaignBySlug(slug: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select(
      `
        id,
        slug,
        title,
        discount_percent,
        validity_days,
        starts_at,
        ends_at,
        is_active,
        stores (
          name,
          naver_url,
          kakao_url,
          google_url
        )
      `,
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error("Could not load campaign.");
  }

  return data;
}
