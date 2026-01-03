"use client";

import type { User } from "@supabase/supabase-js";
import { AuthProvider } from "@/components/AuthProvider";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { Tables } from "@/types/supabase";

type Profile = Tables<"profiles">;

interface DashboardContentProps {
  user: User;
  profile: Profile;
  children: React.ReactNode;
}

/**
 * Client-side dashboard content that receives auth data from the server.
 * This component handles the UI rendering after authentication is confirmed.
 */
export function DashboardContent({
  user,
  profile,
  children,
}: DashboardContentProps) {
  return (
    <AuthProvider user={user} profile={profile}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <main className="flex-1">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}
