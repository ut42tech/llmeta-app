import type { User } from "@supabase/supabase-js";
import { create } from "zustand";
import type { Tables } from "@/types/supabase";

type Profile = Tables<"profiles">;

type AuthState = {
  user: User | null;
  profile: Profile | null;
};

type AuthActions = {
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  reset: () => void;
};

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  profile: null,
};

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  reset: () => set(initialState),
}));
