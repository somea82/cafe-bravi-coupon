import { createClient } from "@/lib/supabase/server";
import { isSameOriginRequest } from "@/lib/security/isSameOriginRequest";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return Response.json(
      { error: "INVALID_ORIGIN", message: "허용되지 않은 요청입니다." },
      { status: 403 },
    );
  }

  const supabase = await createClient();
  await supabase.auth.signOut();

  return Response.json({ ok: true });
}
