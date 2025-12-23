import type { Vector3 } from "three";
import { create } from "zustand";

export type WorldContentItem = {
  id: string;
  position: Vector3;
  image: {
    url: string;
    prompt?: string;
  };
  username?: string;
  createdAt: number;
};

export type ConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "failed"
  | "disconnected";

type ConnectionState = {
  status: ConnectionStatus;
  error?: string;
};

type RoomInfo = {
  roomName?: string;
  roomSid?: string;
};

type WorldState = {
  contentItems: WorldContentItem[];
  connection: ConnectionState;
  room: RoomInfo;
};

type WorldActions = {
  addContentItem: (item: Omit<WorldContentItem, "createdAt">) => void;
  removeContentItem: (id: string) => void;
  setConnecting: () => void;
  setConnected: () => void;
  setFailed: (error?: string) => void;
  setDisconnected: () => void;
  resetConnection: () => void;
  setRoomInfo: (info: RoomInfo) => void;
  clearRoomInfo: () => void;
};

type WorldStore = WorldState & WorldActions;

const INITIAL_CONNECTION: ConnectionState = {
  status: "idle",
  error: undefined,
};

const INITIAL_ROOM: RoomInfo = {
  roomName: undefined,
  roomSid: undefined,
};

export const useWorldStore = create<WorldStore>((set) => ({
  contentItems: [],
  connection: { ...INITIAL_CONNECTION },
  room: { ...INITIAL_ROOM },

  addContentItem: (item) => {
    set(() => ({
      contentItems: [{ ...item, createdAt: Date.now() }],
    }));
  },

  removeContentItem: (id) => {
    set((state) => ({
      contentItems: state.contentItems.filter((item) => item.id !== id),
    }));
  },

  setConnecting: () =>
    set({ connection: { status: "connecting", error: undefined } }),

  setConnected: () =>
    set({ connection: { status: "connected", error: undefined } }),

  setFailed: (error?: string) =>
    set({ connection: { status: "failed", error } }),

  setDisconnected: () =>
    set((state) => ({
      connection: { ...state.connection, status: "disconnected" },
    })),

  resetConnection: () => set({ connection: { ...INITIAL_CONNECTION } }),

  setRoomInfo: (info) =>
    set((state) => ({
      room: { ...state.room, ...info },
    })),

  clearRoomInfo: () => set({ room: { ...INITIAL_ROOM } }),
}));
