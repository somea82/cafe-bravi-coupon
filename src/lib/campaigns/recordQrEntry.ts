import "server-only";

import { QrEntryError } from "@/lib/campaigns/errors";
import { createAdminClient } from "@/lib/supabase/admin";

export async function recordQrEntry(campaignId: string, visitorId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("record_qr_entry", {
    p_campaign_id: campaignId,
    p_visitor_id: visitorId,
  });

  if (error || !data) {
    throw new QrEntryError("DATABASE_ERROR", "Could not record QR entry.");
  }

  return data;
}
