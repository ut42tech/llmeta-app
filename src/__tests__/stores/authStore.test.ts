import type { User } from "@supabase/supabase-js";
import { beforeEach, describe, expect, it } from "vitest";
import { useAuthStore } from "@/stores/authStore";

const createMockUser = (overrides?: Partial<User>): User =>
  ({
    id: "user-123",
    email: "test@example.com",
    aud: "authenticated",
    created_at: "2026-01-01T00:00:00Z",
    app_metadata: {},
    user_metadata: {},
    ...overrides,
  }) as User;

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.getState().reset();
  });

  describe("initial state", () => {
    it("has correct initial state", () => {
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.profile).toBeNull();
    });
  });

  describe("setUser", () => {
    it("sets user correctly", () => {
      const mockUser = createMockUser();

      useAuthStore.getState().setUser(mockUser);

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
    });

    it("clears user when set to null", () => {
      const mockUser = createMockUser();

      useAuthStore.getState().setUser(mockUser);
      useAuthStore.getState().setUser(null);

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
    });
  });

  describe("setProfile", () => {
    it("sets profile correctly", () => {
      const mockProfile = {
        id: "user-123",
        display_name: "Test User",
        avatar_id: 1,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      };

      useAuthStore.getState().setProfile(mockProfile);

      const state = useAuthStore.getState();
      expect(state.profile).toEqual(mockProfile);
    });

    it("clears profile when set to null", () => {
      const mockProfile = {
        id: "user-123",
        display_name: "Test User",
        avatar_id: 1,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      };

      useAuthStore.getState().setProfile(mockProfile);
      useAuthStore.getState().setProfile(null);

      const state = useAuthStore.getState();
      expect(state.profile).toBeNull();
    });
  });

  describe("reset", () => {
    it("resets all state to initial values", () => {
      const mockUser = createMockUser();

      const mockProfile = {
        id: "user-123",
        display_name: "Test User",
        avatar_id: 1,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      };

      useAuthStore.getState().setUser(mockUser);
      useAuthStore.getState().setProfile(mockProfile);

      useAuthStore.getState().reset();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.profile).toBeNull();
    });
  });

  describe("authentication state helpers", () => {
    it("can determine if user is authenticated", () => {
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();

      const mockUser = createMockUser();

      useAuthStore.getState().setUser(mockUser);

      const updatedState = useAuthStore.getState();
      expect(updatedState.user).not.toBeNull();
      expect(updatedState.user?.id).toBe("user-123");
    });
  });
});
