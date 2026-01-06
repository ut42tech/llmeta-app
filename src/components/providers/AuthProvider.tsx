"use client";

import type { User } from "@supabase/supabase-js";
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useLanguageStore } from "@/stores/languageStore";
import type { Tables } from "@/types/supabase";

type Profile = Tables<"profiles">;

interface AuthProviderProps {
  user: User;
  profile: Profile;
  children: React.ReactNode;
}

/**
 * AuthProvider initializes the auth store with server-fetched user data.
 */
export function AuthProvider({ user, profile, children }: AuthProviderProps) {
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const authStore = useAuthStore.getState();
    authStore.setUser(user);
    authStore.setProfile(profile);

    // Initialize language from profile if set
    const languageStore = useLanguageStore.getState();
    if (profile.lang) {
      languageStore.initializeFromProfile(profile.lang);
    }
  }, [user, profile]);

  return <>{children}</>;
}
