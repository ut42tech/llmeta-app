import { useFrame } from "@react-three/fiber";
import {
  MoveBackwardAction,
  MoveForwardAction,
  MoveLeftAction,
  MoveRightAction,
} from "@react-three/viverse";
import { useMemo } from "react";
import { Vector2 } from "three";

/**
 * Hook to calculate the normalized movement direction based on input actions.
 * @returns A Vector2 representing the normalized direction (x: right-left, y: forward-backward)
 */
export function useMovementDirection() {
  const normalizedDirection = useMemo(() => new Vector2(), []);

  useFrame(() => {
    normalizedDirection
      .set(
        MoveRightAction.get() - MoveLeftAction.get(),
        MoveForwardAction.get() - MoveBackwardAction.get(),
      )
      .normalize();
  });

  return normalizedDirection;
}
