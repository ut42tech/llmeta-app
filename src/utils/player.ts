/**
 * Player-related utility functions
 */
import type { Euler, Vector3 } from "three";
import type { MoveData, Vec3 } from "@/types";

/**
 * Convert Vector3/Euler to plain Vec3 object
 */
const toVec3 = (v: Vector3 | Euler): Vec3 => ({
  x: v.x,
  y: v.y,
  z: v.z,
});

/**
 * Build movement data from position and rotation
 */
export const createMoveData = (
  position: Vector3,
  rotation: Euler,
  isRunning: boolean,
  animation: string,
): MoveData => ({
  position: toVec3(position),
  rotation: { x: rotation.x, y: rotation.y, z: 0 },
  isRunning,
  animation,
});
