import "server-only";

import { hashVisitorKey } from "@/lib/security/hashToken";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateVisitorKey } from "@/lib/visitors/generateVisitorKey";

export async function getOrCreateVisitor(existingVisitorKey?: string) {
  const supabase = createAdminClient();

  if (existingVisitorKey && existingVisitorKey.length <= 128) {
    const { data, error } = await supabase
      .from("visitors")
      .select("id")
      .eq("visitor_key_hash", hashVisitorKey(existingVisitorKey))
      .maybeSingle();

    if (error) {
      throw new Error("Could not look up visitor.");
    }

    if (data) {
      return {
        id: data.id,
        visitorKey: existingVisitorKey,
        created: false,
      };
    }
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const visitorKey = generateVisitorKey();
    const { data, error } = await supabase
      .from("visitors")
      .insert({ visitor_key_hash: hashVisitorKey(visitorKey) })
      .select("id")
      .single();

    if (!error && data) {
      return {
        id: data.id,
        visitorKey,
        created: true,
      };
    }

    if (error?.code !== "23505") {
      throw new Error("Could not create visitor.");
    }
  }

  throw new Error("Could not allocate a unique visitor key.");
}
