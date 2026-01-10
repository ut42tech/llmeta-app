"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores";
import type { Tables } from "@/types/supabase";

type Profile = Tables<"profiles">;

export function useAuth() {
  const router = useRouter();
  const supabase = createClient();

  const { user, profile, setProfile, reset } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      profile: state.profile,
      setProfile: state.setProfile,
      reset: state.reset,
    })),
  );

  const fetchProfile = useCallback(
    async (userId: string): Promise<Profile | null> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      return data;
    },
    [supabase],
  );

  const updateProfile = useCallback(
    async (updates: Partial<Profile>): Promise<Profile | null> => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating profile:", error);
        return null;
      }

      setProfile(data);
      return data;
    },
    [supabase, user, setProfile],
  );

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
    reset();
    router.push("/login");
    router.refresh();
  }, [supabase, reset, router]);

  // Listen for auth state changes (sign out, token refresh)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const store = useAuthStore.getState();

      if (event === "SIGNED_OUT") {
        store.reset();
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        store.setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return {
    user,
    profile,
    isAuthenticated: !!user && !!profile,
    updateProfile,
    signOut,
    refetchProfile: user ? () => fetchProfile(user.id) : undefined,
  };
}
