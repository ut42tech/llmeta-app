import { beforeEach, describe, expect, it } from "vitest";
import { useRemotePlayersStore } from "@/stores/remotePlayersStore";

describe("useRemotePlayersStore", () => {
  beforeEach(() => {
    useRemotePlayersStore.getState().clearAll();
  });

  describe("initial state", () => {
    it("has empty players record", () => {
      const { players } = useRemotePlayersStore.getState();
      expect(players).toEqual({});
    });
  });

  describe("upsertPlayer", () => {
    it("adds new player with defaults", () => {
      useRemotePlayersStore.getState().upsertPlayer("player-1", {
        username: "TestUser",
      });

      const { players } = useRemotePlayersStore.getState();
      expect(players["player-1"]).toBeDefined();
      expect(players["player-1"].sessionId).toBe("player-1");
      expect(players["player-1"].username).toBe("TestUser");
      expect(players["player-1"].isMuted).toBe(true);
      expect(players["player-1"].isSpeaking).toBe(false);
    });

    it("updates existing player data", () => {
      useRemotePlayersStore.getState().upsertPlayer("player-1", {
        username: "OldName",
      });
      useRemotePlayersStore.getState().upsertPlayer("player-1", {
        username: "NewName",
        isRunning: true,
      });

      const { players } = useRemotePlayersStore.getState();
      expect(players["player-1"].username).toBe("NewName");
      expect(players["player-1"].isRunning).toBe(true);
    });

    it("preserves other fields when updating", () => {
      useRemotePlayersStore.getState().upsertPlayer("player-1", {
        username: "User1",
        isMuted: false,
      });
      useRemotePlayersStore.getState().upsertPlayer("player-1", {
        isRunning: true,
      });

      const { players } = useRemotePlayersStore.getState();
      expect(players["player-1"].username).toBe("User1");
      expect(players["player-1"].isMuted).toBe(false);
      expect(players["player-1"].isRunning).toBe(true);
    });
  });

  describe("removePlayer", () => {
    it("removes player by sessionId", () => {
      useRemotePlayersStore.getState().upsertPlayer("player-1", {});
      useRemotePlayersStore.getState().upsertPlayer("player-2", {});

      useRemotePlayersStore.getState().removePlayer("player-1");

      const { players } = useRemotePlayersStore.getState();
      expect(players["player-1"]).toBeUndefined();
      expect(players["player-2"]).toBeDefined();
    });

    it("does nothing for non-existent player", () => {
      useRemotePlayersStore.getState().upsertPlayer("player-1", {});

      useRemotePlayersStore.getState().removePlayer("non-existent");

      const { players } = useRemotePlayersStore.getState();
      expect(Object.keys(players)).toHaveLength(1);
    });
  });

  describe("setPlayerMuteStatus", () => {
    it("updates isMuted for existing player", () => {
      useRemotePlayersStore.getState().upsertPlayer("player-1", {});

      useRemotePlayersStore.getState().setPlayerMuteStatus("player-1", false);

      const { players } = useRemotePlayersStore.getState();
      expect(players["player-1"].isMuted).toBe(false);
    });

    it("does nothing for non-existent player", () => {
      useRemotePlayersStore
        .getState()
        .setPlayerMuteStatus("non-existent", false);

      const { players } = useRemotePlayersStore.getState();
      expect(players["non-existent"]).toBeUndefined();
    });
  });

  describe("setPlayerSpeakingStatus", () => {
    it("updates isSpeaking for existing player", () => {
      useRemotePlayersStore.getState().upsertPlayer("player-1", {});

      useRemotePlayersStore
        .getState()
        .setPlayerSpeakingStatus("player-1", true);

      const { players } = useRemotePlayersStore.getState();
      expect(players["player-1"].isSpeaking).toBe(true);
    });

    it("does nothing for non-existent player", () => {
      useRemotePlayersStore
        .getState()
        .setPlayerSpeakingStatus("non-existent", true);

      const { players } = useRemotePlayersStore.getState();
      expect(players["non-existent"]).toBeUndefined();
    });
  });

  describe("clearAll", () => {
    it("removes all players", () => {
      useRemotePlayersStore.getState().upsertPlayer("player-1", {});
      useRemotePlayersStore.getState().upsertPlayer("player-2", {});
      useRemotePlayersStore.getState().upsertPlayer("player-3", {});

      useRemotePlayersStore.getState().clearAll();

      const { players } = useRemotePlayersStore.getState();
      expect(players).toEqual({});
    });
  });
});
