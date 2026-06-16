import "server-only";

import { hashVisitorKey } from "@/lib/security/hashToken";
import { createAdminClient } from "@/lib/supabase/admin";

export async function hasValidQrEntry(
  slug: string,
  visitorKey: string | undefined,
) {
  if (!visitorKey) {
    return false;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("has_valid_qr_entry", {
    p_campaign_slug: slug,
    p_visitor_key_hash: hashVisitorKey(visitorKey),
  });

  if (error) {
    throw new Error("Could not check QR entry.");
  }

  return data;
}
