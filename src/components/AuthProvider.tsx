"use client";

import type { User } from "@supabase/supabase-js";
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/authStore";
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

    const store = useAuthStore.getState();
    store.setUser(user);
    store.setProfile(profile);
  }, [user, profile]);

  return <>{children}</>;
}
