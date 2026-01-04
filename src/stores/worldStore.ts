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

type WorldState = {
  instanceId: string | null;
  contentItems: WorldContentItem[];
  connection: ConnectionState;
};

type WorldActions = {
  setInstanceId: (id: string | null) => void;
  addContentItem: (item: Omit<WorldContentItem, "createdAt">) => void;
  removeContentItem: (id: string) => void;
  setConnecting: () => void;
  setConnected: () => void;
  setFailed: (error?: string) => void;
  setDisconnected: () => void;
  resetConnection: () => void;
};

type WorldStore = WorldState & WorldActions;

const INITIAL_CONNECTION: ConnectionState = {
  status: "idle",
  error: undefined,
};

export const useWorldStore = create<WorldStore>((set) => ({
  instanceId: null,
  contentItems: [],
  connection: { ...INITIAL_CONNECTION },

  setInstanceId: (id) => set({ instanceId: id }),

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

  resetConnection: () =>
    set({ instanceId: null, connection: { ...INITIAL_CONNECTION } }),
}));
