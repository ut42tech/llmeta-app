"use client";

import type { User } from "@supabase/supabase-js";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AuthProvider } from "@/components/providers";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { Tables } from "@/types/supabase";

type Profile = Tables<"profiles">;

interface HubLayoutProps {
  user: User;
  profile: Profile;
  children: React.ReactNode;
}

/**
 * Client-side hub layout that receives auth data from the server.
 * This component handles the UI rendering after authentication is confirmed.
 */
export function HubLayout({ user, profile, children }: HubLayoutProps) {
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
