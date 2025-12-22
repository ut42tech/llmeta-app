import type { Vector3 } from "three";
import { create } from "zustand";
import { GRID } from "@/constants/world";

type GridCoordinates = {
  x: number;
  y: number;
};

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
  currentGridCell: GridCoordinates;
  visibleGridSize: GridCoordinates;
  contentItems: WorldContentItem[];
  connection: ConnectionState;
};

type WorldActions = {
  updateCurrentGridCell: (position: Vector3) => void;
  addContentItem: (item: Omit<WorldContentItem, "createdAt">) => void;
  removeContentItem: (id: string) => void;
  setConnecting: () => void;
  setConnected: () => void;
  setFailed: (error?: string) => void;
  setDisconnected: () => void;
  resetConnection: () => void;
};

type WorldStore = WorldState & WorldActions;

const INITIAL_GRID_CELL: GridCoordinates = { x: 0, y: 0 };
const DEFAULT_VISIBLE_GRID_SIZE: GridCoordinates = { x: 3, y: 3 };
const INITIAL_CONNECTION: ConnectionState = {
  status: "idle",
  error: undefined,
};

const calculateGridCell = (position: Vector3): GridCoordinates => ({
  x: Math.floor((position.x + GRID.HALF_CELL_SIZE) / GRID.CELL_SIZE),
  y: Math.floor((position.z + GRID.HALF_CELL_SIZE) / GRID.CELL_SIZE),
});

const isGridCellEqual = (
  cell1: GridCoordinates,
  cell2: GridCoordinates,
): boolean => cell1.x === cell2.x && cell1.y === cell2.y;

/**
 * Unified world state store.
 * Manages grid-based world system and connection state.
 */
export const useWorldStore = create<WorldStore>((set) => ({
  currentGridCell: { ...INITIAL_GRID_CELL },
  visibleGridSize: { ...DEFAULT_VISIBLE_GRID_SIZE },
  contentItems: [],
  connection: { ...INITIAL_CONNECTION },

  updateCurrentGridCell: (position: Vector3) => {
    const newGridCell = calculateGridCell(position);

    set((state) => {
      if (isGridCellEqual(state.currentGridCell, newGridCell)) {
        return state;
      }

      return {
        currentGridCell: newGridCell,
      };
    });
  },

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
}));
