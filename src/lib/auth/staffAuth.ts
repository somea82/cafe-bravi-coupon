import "server-only";

import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

const STAFF_ROLES = new Set(["admin", "staff"]);

export function isStaffUser(user: User) {
  return STAFF_ROLES.has(user.app_metadata.role);
}

export async function getStaffUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user || !isStaffUser(user)) {
    return null;
  }

  return user;
}

export async function requireStaffUser() {
  const user = await getStaffUser();

  if (!user) {
    redirect("/admin/login");
  }

  return user;
}
