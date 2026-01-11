import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const unauthorized = () =>
  NextResponse.json({ error: "Unauthorized" }, { status: 401 });

/**
 * Require authentication for API routes.
 * Returns user and supabase client for subsequent operations.
 */
export async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, supabase, error: unauthorized() };
  return { user, supabase, error: null };
}
