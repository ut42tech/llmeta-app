import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

// Store original env
const originalEnv = { ...process.env };

// Create mock functions that we can spy on
const mockAddGrant = vi.fn();
const mockToJwt = vi.fn().mockResolvedValue("mock-jwt-token");
let lastConstructorArgs: unknown[] = [];

// Mock livekit-server-sdk with a proper class
vi.mock("livekit-server-sdk", () => {
  return {
    AccessToken: class MockAccessToken {
      static lastArgs: unknown[] = [];
      constructor(apiKey: string, apiSecret: string, options: unknown) {
        lastConstructorArgs = [apiKey, apiSecret, options];
      }
      addGrant = mockAddGrant;
      toJwt = mockToJwt;
    },
  };
});

// Import after mocking
import { createLiveKitAccessToken } from "@/utils/livekit-server";

// Helper to get the constructor options
const getConstructorOptions = () =>
  lastConstructorArgs[2] as Record<string, unknown>;

describe("createLiveKitAccessToken", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    lastConstructorArgs = [];
    // Reset env for each test
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    // Restore original env
    process.env = originalEnv;
  });

  describe("config validation", () => {
    it("throws error when LIVEKIT_API_KEY is missing", async () => {
      process.env.LIVEKIT_API_KEY = "";
      process.env.LIVEKIT_API_SECRET = "secret";
      process.env.LIVEKIT_URL = "wss://livekit.example.com";

      await expect(
        createLiveKitAccessToken({ identity: "user-1", name: "User" }),
      ).rejects.toThrow("Missing LiveKit server configuration");
    });

    it("throws error when LIVEKIT_API_SECRET is missing", async () => {
      process.env.LIVEKIT_API_KEY = "key";
      process.env.LIVEKIT_API_SECRET = "";
      process.env.LIVEKIT_URL = "wss://livekit.example.com";

      await expect(
        createLiveKitAccessToken({ identity: "user-1", name: "User" }),
      ).rejects.toThrow("Missing LiveKit server configuration");
    });

    it("throws error when LIVEKIT_URL is missing", async () => {
      process.env.LIVEKIT_API_KEY = "key";
      process.env.LIVEKIT_API_SECRET = "secret";
      process.env.LIVEKIT_URL = "";

      await expect(
        createLiveKitAccessToken({ identity: "user-1", name: "User" }),
      ).rejects.toThrow("Missing LiveKit server configuration");
    });

    it("throws error when all config is missing", async () => {
      process.env.LIVEKIT_API_KEY = "";
      process.env.LIVEKIT_API_SECRET = "";
      process.env.LIVEKIT_URL = "";

      await expect(
        createLiveKitAccessToken({ identity: "user-1", name: "User" }),
      ).rejects.toThrow("Missing LiveKit server configuration");
    });
  });

  describe("with valid config", () => {
    beforeEach(() => {
      process.env.LIVEKIT_API_KEY = "test-api-key";
      process.env.LIVEKIT_API_SECRET = "test-api-secret";
      process.env.LIVEKIT_URL = "wss://livekit.example.com";
      process.env.LIVEKIT_ROOM = "default-room";
    });

    it("creates AccessToken with correct credentials", async () => {
      await createLiveKitAccessToken({ identity: "user-1", name: "User" });

      expect(lastConstructorArgs[0]).toBe("test-api-key");
      expect(lastConstructorArgs[1]).toBe("test-api-secret");
      expect(getConstructorOptions()).toMatchObject({
        identity: "user-1",
        name: "User",
      });
    });

    it("uses provided roomName over env default", async () => {
      const result = await createLiveKitAccessToken({
        identity: "user-1",
        name: "User",
        roomName: "custom-room",
      });

      expect(result.roomName).toBe("custom-room");
    });

    it("falls back to LIVEKIT_ROOM env when roomName not provided", async () => {
      const result = await createLiveKitAccessToken({
        identity: "user-1",
        name: "User",
      });

      expect(result.roomName).toBe("default-room");
    });

    it("falls back to 'playground' when no roomName and no env", async () => {
      delete process.env.LIVEKIT_ROOM;

      const result = await createLiveKitAccessToken({
        identity: "user-1",
        name: "User",
      });

      expect(result.roomName).toBe("playground");
    });

    it("uses provided TTL", async () => {
      await createLiveKitAccessToken({
        identity: "user-1",
        name: "User",
        ttl: 1800, // 30 minutes
      });

      expect(getConstructorOptions().ttl).toBe(1800);
    });

    it("uses default TTL of 1 hour when not provided", async () => {
      await createLiveKitAccessToken({
        identity: "user-1",
        name: "User",
      });

      expect(getConstructorOptions().ttl).toBe(3600);
    });

    it("returns token and serverUrl", async () => {
      const result = await createLiveKitAccessToken({
        identity: "user-1",
        name: "User",
      });

      expect(result.token).toBe("mock-jwt-token");
      expect(result.serverUrl).toBe("wss://livekit.example.com");
    });

    it("serializes metadata to JSON", async () => {
      await createLiveKitAccessToken({
        identity: "user-1",
        name: "User",
        metadata: { avatarId: 5, level: 10 },
      });

      expect(getConstructorOptions().metadata).toBe(
        JSON.stringify({ avatarId: 5, level: 10 }),
      );
    });

    it("passes undefined metadata when not provided", async () => {
      await createLiveKitAccessToken({
        identity: "user-1",
        name: "User",
      });

      expect(getConstructorOptions().metadata).toBeUndefined();
    });
  });

  describe("token grants", () => {
    beforeEach(() => {
      process.env.LIVEKIT_API_KEY = "test-api-key";
      process.env.LIVEKIT_API_SECRET = "test-api-secret";
      process.env.LIVEKIT_URL = "wss://livekit.example.com";
    });

    it("adds room grants with correct permissions", async () => {
      await createLiveKitAccessToken({
        identity: "user-1",
        name: "User",
        roomName: "test-room",
      });

      expect(mockAddGrant).toHaveBeenCalledWith({
        room: "test-room",
        roomJoin: true,
        canPublish: true,
        canSubscribe: true,
        canPublishData: true,
        canUpdateOwnMetadata: true,
      });
    });
  });
});
