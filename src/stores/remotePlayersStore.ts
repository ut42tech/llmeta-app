import { Euler, Vector3 } from "three";
import { create } from "zustand";
import type { ViverseAvatar } from "@/utils/colyseus";

/**
 * Remote player state
 */
export type RemotePlayerData = {
  sessionId: string;
  username: string;
  position: Vector3;
  rotation: Euler;
  isRunning: boolean;
  animation: string;
  avatar?: ViverseAvatar;
};

type RemotePlayersState = {
  players: Map<string, RemotePlayerData>;
};

type RemotePlayersActions = {
  addOrUpdatePlayer: (
    sessionId: string,
    data: Partial<RemotePlayerData>,
  ) => void;
  removePlayer: (sessionId: string) => void;
  clearAll: () => void;
};

type RemotePlayersStore = RemotePlayersState & RemotePlayersActions;

const initialState: RemotePlayersState = {
  players: new Map(),
};

/**
 * Store for remote player state.
 * Manages other players in a multiplayer environment.
 */
export const useRemotePlayersStore = create<RemotePlayersStore>((set) => ({
  // State
  ...initialState,

  // Actions
  addOrUpdatePlayer: (sessionId: string, data: Partial<RemotePlayerData>) => {
    set((state) => {
      const newPlayers = new Map(state.players);
      const existingPlayer = newPlayers.get(sessionId);

      // Create or update player data
      const updatedPlayer: RemotePlayerData = {
        sessionId,
        username: data.username ?? existingPlayer?.username ?? "Player",
        position: data.position ?? existingPlayer?.position ?? new Vector3(),
        rotation: data.rotation ?? existingPlayer?.rotation ?? new Euler(),
        isRunning: data.isRunning ?? existingPlayer?.isRunning ?? false,
        animation: data.animation ?? existingPlayer?.animation ?? "idle",
        avatar: data.avatar ?? existingPlayer?.avatar,
      };

      newPlayers.set(sessionId, updatedPlayer);

      return { players: newPlayers };
    });
  },

  removePlayer: (sessionId: string) => {
    set((state) => {
      const newPlayers = new Map(state.players);
      newPlayers.delete(sessionId);
      return { players: newPlayers };
    });
  },

  clearAll: () => {
    set({ players: new Map() });
  },
}));
