import type { Vector3 } from "three";
import { create } from "zustand";
import { GRID } from "@/constants/world";

// Types
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

type WorldState = {
  currentGridCell: GridCoordinates;
  visibleGridSize: GridCoordinates;
  contentItems: WorldContentItem[];
};

type WorldActions = {
  updateCurrentGridCell: (position: Vector3) => void;
  addContentItem: (item: Omit<WorldContentItem, "createdAt">) => void;
  removeContentItem: (id: string) => void;
};

type WorldStore = WorldState & WorldActions;

// Constants
const INITIAL_GRID_CELL: GridCoordinates = { x: 0, y: 0 };
const DEFAULT_VISIBLE_GRID_SIZE: GridCoordinates = { x: 3, y: 3 };

// Helper functions
const calculateGridCell = (position: Vector3): GridCoordinates => ({
  x: Math.floor((position.x + GRID.HALF_CELL_SIZE) / GRID.CELL_SIZE),
  y: Math.floor((position.z + GRID.HALF_CELL_SIZE) / GRID.CELL_SIZE),
});

const isGridCellEqual = (
  cell1: GridCoordinates,
  cell2: GridCoordinates,
): boolean => cell1.x === cell2.x && cell1.y === cell2.y;

/**
 * World state store.
 * Manages a grid-based infinite world system.
 */
export const useWorldStore = create<WorldStore>((set) => ({
  // State
  currentGridCell: { ...INITIAL_GRID_CELL },
  visibleGridSize: { ...DEFAULT_VISIBLE_GRID_SIZE },
  contentItems: [],

  // Actions
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
}));
