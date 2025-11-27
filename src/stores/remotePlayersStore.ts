import { Euler, Vector3 } from "three";
import { create } from "zustand";
import {
  removeEntity,
  updateEntityField,
  upsertEntity,
} from "@/stores/helpers";
import type { AnimationState, EntityRecord, RemotePlayer } from "@/types";

type RemotePlayersState = {
  players: EntityRecord<RemotePlayer>;
};

type RemotePlayersActions = {
  upsertPlayer: (sessionId: string, data: Partial<RemotePlayer>) => void;
  removePlayer: (sessionId: string) => void;
  setPlayerMuteStatus: (sessionId: string, isMuted: boolean) => void;
  setPlayerSpeakingStatus: (sessionId: string, isSpeaking: boolean) => void;
  clearAll: () => void;
};

type RemotePlayersStore = RemotePlayersState & RemotePlayersActions;

const createDefaultPlayer = (sessionId: string): RemotePlayer => ({
  sessionId,
  username: "Anonymous",
  position: new Vector3(),
  rotation: new Euler(),
  isRunning: false,
  animation: "idle" as AnimationState,
  avatar: undefined,
  isMuted: true,
  isSpeaking: false,
});

const initialState: RemotePlayersState = {
  players: {},
};

/**
 * Store for remote player state.
 * Manages other players in a multiplayer environment.
 */
export const useRemotePlayersStore = create<RemotePlayersStore>((set) => ({
  ...initialState,

  upsertPlayer: (sessionId, data) =>
    set((state) => ({
      players: upsertEntity(
        state.players,
        sessionId,
        { ...data, sessionId },
        createDefaultPlayer(sessionId),
      ),
    })),

  removePlayer: (sessionId) =>
    set((state) => ({
      players: removeEntity(state.players, sessionId),
    })),

  setPlayerMuteStatus: (sessionId, isMuted) =>
    set((state) => ({
      players: updateEntityField(state.players, sessionId, "isMuted", isMuted),
    })),

  setPlayerSpeakingStatus: (sessionId, isSpeaking) =>
    set((state) => ({
      players: updateEntityField(
        state.players,
        sessionId,
        "isSpeaking",
        isSpeaking,
      ),
    })),

  clearAll: () => set({ players: {} }),
}));
