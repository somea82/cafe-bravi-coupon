import "server-only";

import { recordQrEntry } from "@/lib/campaigns/recordQrEntry";
import { verifyQrToken } from "@/lib/campaigns/verifyQrToken";
import { getOrCreateVisitor } from "@/lib/visitors/getOrCreateVisitor";

type EnterCampaignInput = {
  slug: string;
  token: string;
  existingVisitorKey?: string;
};

export async function enterCampaignFromQr({
  slug,
  token,
  existingVisitorKey,
}: EnterCampaignInput) {
  const campaign = await verifyQrToken(slug, token);
  const visitor = await getOrCreateVisitor(existingVisitorKey);
  const entry = await recordQrEntry(campaign.id, visitor.id);

  return {
    campaign,
    visitor,
    entry,
  };
}
