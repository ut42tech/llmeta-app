import { create } from "zustand";

type GridCoordinates = { x: number; y: number };

type WorldState = {
  gridSize: GridCoordinates;
};

const DEFAULT_GRID_SIZE: GridCoordinates = { x: 3, y: 3 };

export const worldStore = create<WorldState>(() => ({
  gridSize: { ...DEFAULT_GRID_SIZE },
}));
