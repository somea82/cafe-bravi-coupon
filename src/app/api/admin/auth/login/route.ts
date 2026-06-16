import { createClient } from "@/lib/supabase/server";
import { isSameOriginRequest } from "@/lib/security/isSameOriginRequest";

type LoginBody = {
  email?: unknown;
  password?: unknown;
};

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return Response.json(
      { error: "INVALID_ORIGIN", message: "허용되지 않은 요청입니다." },
      { status: 403 },
    );
  }

  let body: LoginBody;

  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return Response.json(
      { error: "INVALID_REQUEST", message: "로그인 정보를 확인해 주세요." },
      { status: 400 },
    );
  }

  if (
    typeof body.email !== "string" ||
    typeof body.password !== "string" ||
    body.email.length > 254 ||
    body.password.length > 256
  ) {
    return Response.json(
      { error: "INVALID_REQUEST", message: "로그인 정보를 확인해 주세요." },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: body.email.trim().toLowerCase(),
    password: body.password,
  });

  if (error || !data.user) {
    return Response.json(
      {
        error: "INVALID_CREDENTIALS",
        message: "이메일 또는 비밀번호가 올바르지 않습니다.",
      },
      { status: 401 },
    );
  }

  if (!["admin", "staff"].includes(data.user.app_metadata.role)) {
    await supabase.auth.signOut();

    return Response.json(
      {
        error: "STAFF_ACCESS_REQUIRED",
        message: "직원 권한이 없는 계정입니다.",
      },
      { status: 403 },
    );
  }

  return Response.json({ ok: true });
}
