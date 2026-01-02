import type { User } from "@supabase/supabase-js";
import { create } from "zustand";
import type { Tables } from "@/types/supabase";

type Profile = Tables<"profiles">;

type AuthState = {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isInitialized: boolean;
};

type AuthActions = {
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsInitialized: (isInitialized: boolean) => void;
  reset: () => void;
};

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  profile: null,
  isLoading: true,
  isInitialized: false,
};

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsInitialized: (isInitialized) => set({ isInitialized }),
  reset: () => set(initialState),
}));
