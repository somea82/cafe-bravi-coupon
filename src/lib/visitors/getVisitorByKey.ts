import "server-only";

import { hashVisitorKey } from "@/lib/security/hashToken";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getVisitorByKey(visitorKey: string | undefined) {
  if (!visitorKey || visitorKey.length > 128) {
    return null;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("visitors")
    .select("id")
    .eq("visitor_key_hash", hashVisitorKey(visitorKey))
    .maybeSingle();

  if (error) {
    throw new Error("Could not load visitor.");
  }

  return data;
}
