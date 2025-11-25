import type { Euler, Vector3 } from "three";

/**
 * Plain object representation of a 3D vector
 */
export type Vec3Plain = {
  x: number;
  y: number;
  z: number;
};

/**
 * Convert a Vector3 or Euler to a plain object
 * Useful for serialization and data transfer
 *
 * @param v - Vector3 or Euler to convert
 * @returns Plain object with x, y, z properties
 */
export const toPlainVec3 = (v: Vector3 | Euler): Vec3Plain => {
  return { x: v.x, y: v.y, z: v.z };
};

/**
 * Round a number to the specified decimal places
 *
 * @param value - The number to round
 * @param decimals - Number of decimal places (default: 2)
 * @returns Rounded number
 *
 * @example
 * roundToDecimals(3.14159, 2) // 3.14
 * roundToDecimals(3.14159, 4) // 3.1416
 */
export const roundToDecimals = (value: number, decimals = 2): number => {
  const multiplier = 10 ** decimals;
  return Math.round(value * multiplier) / multiplier;
};

/**
 * Clamp a value between min and max
 *
 * @param value - The value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

/**
 * Linear interpolation between two values
 *
 * @param a - Start value
 * @param b - End value
 * @param t - Interpolation factor (0-1)
 * @returns Interpolated value
 */
export const lerp = (a: number, b: number, t: number): number => {
  return a + (b - a) * t;
};

/**
 * Normalize an angle to the range [-π, π]
 *
 * @param angle - Angle in radians
 * @returns Normalized angle
 */
export const normalizeAngle = (angle: number): number => {
  return ((angle + Math.PI) % (2 * Math.PI)) - Math.PI;
};
