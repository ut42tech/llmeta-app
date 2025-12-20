import { Euler, Vector3 } from "three";
import { create } from "zustand";
import type { EntityRecord } from "@/types/common";
import type { AnimationState, RemotePlayer } from "@/types/player";

// Inline helpers (previously in stores/helpers.ts)
const upsertEntity = <T extends Record<string, unknown>>(
  record: EntityRecord<T>,
  id: string,
  data: Partial<T>,
  defaults: T,
): EntityRecord<T> => ({
  ...record,
  [id]: record[id] ? { ...record[id], ...data } : { ...defaults, ...data },
});

const removeEntity = <T>(
  record: EntityRecord<T>,
  id: string,
): EntityRecord<T> => {
  const { [id]: _, ...rest } = record;
  return rest;
};

const updateField = <T, K extends keyof T>(
  record: EntityRecord<T>,
  id: string,
  field: K,
  value: T[K],
): EntityRecord<T> => {
  const existing = record[id];
  if (!existing) return record;
  return { ...record, [id]: { ...existing, [field]: value } };
};

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
      players: updateField(state.players, sessionId, "isMuted", isMuted),
    })),

  setPlayerSpeakingStatus: (sessionId, isSpeaking) =>
    set((state) => ({
      players: updateField(state.players, sessionId, "isSpeaking", isSpeaking),
    })),

  clearAll: () => set({ players: {} }),
}));
