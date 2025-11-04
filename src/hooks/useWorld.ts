// import type { Avatar } from "@react-three/viverse";
import { Vector3 } from "three";
import { create } from "zustand";

export const GRID_CELL_SIZE = 20;
export const HALF_GRID_CELL_SIZE = GRID_CELL_SIZE / 2;

type GridCoordinates = { x: number; y: number };

type WorldState = {
  characterPosition: Vector3;
  gridPosition: GridCoordinates;
  gridSize: GridCoordinates;
  computeCharacterCell: (position: Vector3) => void;
};

const INITIAL_GRID_POSITION: GridCoordinates = { x: 0, y: 0 };
const DEFAULT_GRID_SIZE: GridCoordinates = { x: 3, y: 3 };

const deriveGridCoordinates = (position: Vector3): GridCoordinates => ({
  x: Math.floor((position.x + HALF_GRID_CELL_SIZE) / GRID_CELL_SIZE),
  y: Math.floor((position.z + HALF_GRID_CELL_SIZE) / GRID_CELL_SIZE),
});

export const useWorld = create<WorldState>((set, _get) => ({
  characterPosition: new Vector3(0, 0, 0),
  gridPosition: { ...INITIAL_GRID_POSITION },
  gridSize: { ...DEFAULT_GRID_SIZE },
  computeCharacterCell: (position: Vector3) => {
    const nextGridPosition = deriveGridCoordinates(position);

    set((state) => {
      const hasGridChanged =
        state.gridPosition.x !== nextGridPosition.x ||
        state.gridPosition.y !== nextGridPosition.y;

      const nextCharacterPosition = position.clone();

      if (!hasGridChanged) {
        return { characterPosition: nextCharacterPosition };
      }

      return {
        characterPosition: nextCharacterPosition,
        gridPosition: nextGridPosition,
      };
    });
  },
}));
