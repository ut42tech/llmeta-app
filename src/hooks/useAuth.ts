"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/authStore";
import type { Tables } from "@/types/supabase";

type Profile = Tables<"profiles">;

export function useAuth() {
  const router = useRouter();
  const supabase = createClient();

  const {
    user,
    profile,
    isLoading,
    isInitialized,
    setUser,
    setProfile,
    setIsLoading,
    setIsInitialized,
    reset,
  } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      profile: state.profile,
      isLoading: state.isLoading,
      isInitialized: state.isInitialized,
      setUser: state.setUser,
      setProfile: state.setProfile,
      setIsLoading: state.setIsLoading,
      setIsInitialized: state.setIsInitialized,
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
    await supabase.auth.signOut();
    reset();
    router.push("/login");
    router.refresh();
  }, [supabase, reset, router]);

  const initialize = useCallback(async () => {
    if (isInitialized) return;

    setIsLoading(true);

    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (currentUser) {
        setUser(currentUser);
        const userProfile = await fetchProfile(currentUser.id);
        if (userProfile) {
          setProfile(userProfile);
        }
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, [
    isInitialized,
    supabase,
    fetchProfile,
    setUser,
    setProfile,
    setIsLoading,
    setIsInitialized,
  ]);

  useEffect(() => {
    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user);
        const userProfile = await fetchProfile(session.user.id);
        if (userProfile) {
          setProfile(userProfile);
        }
      } else if (event === "SIGNED_OUT") {
        reset();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initialize, supabase, fetchProfile, setUser, setProfile, reset]);

  return {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    updateProfile,
    signOut,
    refetchProfile: user ? () => fetchProfile(user.id) : undefined,
  };
}
