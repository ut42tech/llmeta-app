import { redirect } from "next/navigation";
import { HubLayout } from "@/components/layout/HubLayout";
import { createClient } from "@/lib/supabase/server";

export default async function HubRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Server-side authentication check
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  // Check for anonymous users (should not be allowed)
  if (user.is_anonymous) {
    await supabase.auth.signOut();
    redirect("/login?error=anonymous_not_allowed");
  }

  // Fetch user profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    // User exists but no profile - sign out and redirect
    await supabase.auth.signOut();
    redirect("/login?error=profile_not_found");
  }

  return (
    <HubLayout user={user} profile={profile}>
      {children}
    </HubLayout>
  );
}
