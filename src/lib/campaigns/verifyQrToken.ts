import "server-only";

import { QrEntryError } from "@/lib/campaigns/errors";
import { hashQrToken } from "@/lib/security/hashToken";
import { createAdminClient } from "@/lib/supabase/admin";

const CAMPAIGN_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function verifyQrToken(slug: string, token: string) {
  if (
    !CAMPAIGN_SLUG_PATTERN.test(slug) ||
    token.length < 16 ||
    token.length > 256
  ) {
    throw new QrEntryError("INVALID_REQUEST", "Invalid QR request.");
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .rpc("verify_qr_token", {
      p_campaign_slug: slug,
      p_token_hash: hashQrToken(token),
    })
    .maybeSingle();

  if (error) {
    throw new QrEntryError("DATABASE_ERROR", "Could not verify QR token.");
  }

  if (!data) {
    throw new QrEntryError("INVALID_QR", "QR token is invalid or inactive.");
  }

  return {
    id: data.campaign_id,
    slug: data.campaign_slug,
  };
}
