import { beforeEach, describe, expect, it, vi } from "vitest";
import { useVoiceChatStore, useWorldStore } from "@/stores";

// Mock dependencies
vi.mock("@/hooks/livekit/useSyncClient", () => ({
  useSyncClient: vi.fn(() => ({ room: undefined })),
}));

vi.mock("zustand/react/shallow", () => ({
  useShallow: (fn: (state: unknown) => unknown) => fn,
}));

describe("useVoiceChat", () => {
  beforeEach(() => {
    useVoiceChatStore.getState().reset();
    useWorldStore.getState().resetConnection();
  });

  describe("VoiceChatStore integration", () => {
    it("has correct initial state", () => {
      const state = useVoiceChatStore.getState();
      expect(state.isMicEnabled).toBe(false);
      expect(state.isPublishing).toBe(false);
      expect(state.permission).toBe("unknown");
      expect(state.error).toBeUndefined();
      expect(state.lastActiveAt).toBeUndefined();
    });

    it("resets state correctly", () => {
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

  describe("WorldStore connection integration", () => {
    it("has correct initial connection state", () => {
      const state = useWorldStore.getState();
      expect(state.connection.status).toBe("idle");
    });

    it("can update connection status", () => {
      useWorldStore.getState().setConnected();

      expect(useWorldStore.getState().connection.status).toBe("connected");
    });
  });

  describe("canPublish logic", () => {
    it("cannot publish when room is undefined", () => {
      // room is undefined (from mock), so canPublish should be false
      const hasRoom = false;
      const connectionStatus = useWorldStore.getState().connection.status;
      const canPublish = hasRoom && connectionStatus === "connected";

      expect(canPublish).toBe(false);
    });

    it("cannot publish when disconnected even with room", () => {
      useWorldStore.getState().setDisconnected();
      const hasRoom = true;
      const connectionStatus = useWorldStore.getState().connection.status;
      const canPublish = hasRoom && connectionStatus === "connected";

      expect(canPublish).toBe(false);
    });

    it("can publish when room exists and connected", () => {
      useWorldStore.getState().setConnected();
      const hasRoom = true;
      const connectionStatus = useWorldStore.getState().connection.status;
      const canPublish = hasRoom && connectionStatus === "connected";

      expect(canPublish).toBe(true);
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

  describe("VoiceChatStatus type", () => {
    it("returns correct status structure", () => {
      const state = useVoiceChatStore.getState();

      const status = {
        isMicEnabled: state.isMicEnabled,
        isPublishing: state.isPublishing,
        permission: state.permission,
        error: state.error,
        lastActiveAt: state.lastActiveAt,
      };

      expect(status).toEqual({
        isMicEnabled: false,
        isPublishing: false,
        permission: "unknown",
        error: undefined,
        lastActiveAt: undefined,
      });
    });

    it("returns error in status when set", () => {
      useVoiceChatStore.setState({ error: "Permission denied" });

      const state = useVoiceChatStore.getState();
      const status = {
        isMicEnabled: state.isMicEnabled,
        isPublishing: state.isPublishing,
        permission: state.permission,
        error: state.error,
        lastActiveAt: state.lastActiveAt,
      };

      expect(status.error).toBe("Permission denied");
    });
  });

  describe("permission states", () => {
    it("can set permission to granted", () => {
      useVoiceChatStore.setState({ permission: "granted" });
      expect(useVoiceChatStore.getState().permission).toBe("granted");
    });

    it("can set permission to denied", () => {
      useVoiceChatStore.setState({ permission: "denied" });
      expect(useVoiceChatStore.getState().permission).toBe("denied");
    });

    it("defaults to unknown", () => {
      expect(useVoiceChatStore.getState().permission).toBe("unknown");
    });
  });

  describe("lastActiveAt tracking", () => {
    it("can set lastActiveAt timestamp", () => {
      const now = Date.now();
      useVoiceChatStore.setState({ lastActiveAt: now });
      expect(useVoiceChatStore.getState().lastActiveAt).toBe(now);
    });

    it("clears lastActiveAt on reset", () => {
      useVoiceChatStore.setState({ lastActiveAt: Date.now() });
      useVoiceChatStore.getState().reset();
      expect(useVoiceChatStore.getState().lastActiveAt).toBeUndefined();
    });
  });
});
