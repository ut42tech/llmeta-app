import { beforeEach, describe, expect, it } from "vitest";
import { useVoiceChatStore } from "@/stores/voiceChatStore";

describe("useVoiceChatStore", () => {
  beforeEach(() => {
    useVoiceChatStore.getState().reset();
  });

  describe("initial state", () => {
    it("has correct initial state", () => {
      const state = useVoiceChatStore.getState();
      expect(state.track).toBeUndefined();
      expect(state.isMicEnabled).toBe(false);
      expect(state.isPublishing).toBe(false);
      expect(state.permission).toBe("unknown");
      expect(state.error).toBeUndefined();
      expect(state.lastActiveAt).toBeUndefined();
      expect(state.krispFilter).toBeUndefined();
    });
  });

  describe("reset", () => {
    it("resets state to initial values", () => {
      // Manually set some state
      useVoiceChatStore.setState({
        isMicEnabled: true,
        isPublishing: true,
        permission: "granted",
        error: "Some error",
        lastActiveAt: Date.now(),
      });

      useVoiceChatStore.getState().reset();

      const state = useVoiceChatStore.getState();
      expect(state.isMicEnabled).toBe(false);
      expect(state.isPublishing).toBe(false);
      expect(state.permission).toBe("unknown");
      expect(state.error).toBeUndefined();
      expect(state.lastActiveAt).toBeUndefined();
    });
  });

  describe("enableMic without room", () => {
    it("does nothing when room is undefined", async () => {
      const { enableMic } = useVoiceChatStore.getState();

      await enableMic(undefined);

      const state = useVoiceChatStore.getState();
      expect(state.isMicEnabled).toBe(false);
      expect(state.isPublishing).toBe(false);
    });
  });

  describe("disableMic without room", () => {
    it("does nothing when room is undefined", async () => {
      const { disableMic } = useVoiceChatStore.getState();

      await disableMic(undefined);

      const state = useVoiceChatStore.getState();
      expect(state.isMicEnabled).toBe(false);
    });
  });

  describe("toggleMic", () => {
    it("does nothing when room is undefined", async () => {
      const { toggleMic } = useVoiceChatStore.getState();

      await toggleMic(undefined);

      expect(useVoiceChatStore.getState().isMicEnabled).toBe(false);
    });
  });

  describe("state transitions", () => {
    it("can set publishing state directly", () => {
      useVoiceChatStore.setState({ isPublishing: true });
      expect(useVoiceChatStore.getState().isPublishing).toBe(true);
    });

    it("can set permission state directly", () => {
      useVoiceChatStore.setState({ permission: "denied" });
      expect(useVoiceChatStore.getState().permission).toBe("denied");
    });

    it("can set error state", () => {
      useVoiceChatStore.setState({ error: "Permission denied" });
      expect(useVoiceChatStore.getState().error).toBe("Permission denied");
    });

    it("can set lastActiveAt", () => {
      const now = Date.now();
      useVoiceChatStore.setState({ lastActiveAt: now });
      expect(useVoiceChatStore.getState().lastActiveAt).toBe(now);
    });
  });
});
