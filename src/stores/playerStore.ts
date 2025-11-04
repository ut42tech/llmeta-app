import { Vector3 } from "three";
import { create } from "zustand";

export const GRID_CELL_SIZE = 20;
export const HALF_GRID_CELL_SIZE = GRID_CELL_SIZE / 2;

type GridCoordinates = { x: number; y: number };

type PlayerState = {
  position: Vector3;
  gridPosition: GridCoordinates;
  updatePosition: (position: Vector3) => void;
};

const INITIAL_PLAYER_POSITION = new Vector3(0, 0, 0);
const INITIAL_GRID_POSITION: GridCoordinates = { x: 0, y: 0 };

const deriveGridCoordinates = (position: Vector3): GridCoordinates => ({
  x: Math.floor((position.x + HALF_GRID_CELL_SIZE) / GRID_CELL_SIZE),
  y: Math.floor((position.z + HALF_GRID_CELL_SIZE) / GRID_CELL_SIZE),
});

export const playerStore = create<PlayerState>((set) => ({
  position: INITIAL_PLAYER_POSITION,
  gridPosition: { ...INITIAL_GRID_POSITION },
  updatePosition: (position: Vector3) => {
    const nextGridPosition = deriveGridCoordinates(position);

    set((state) => {
      const hasGridChanged =
        state.gridPosition.x !== nextGridPosition.x ||
        state.gridPosition.y !== nextGridPosition.y;

      const nextPosition = position.clone();

      if (!hasGridChanged) {
        return { position: nextPosition };
      }

      return {
        position: nextPosition,
        gridPosition: nextGridPosition,
      };
    });
  },
}));
