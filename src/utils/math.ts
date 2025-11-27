/**
 * Math utility functions
 */

/**
 * Round a number to the specified decimal places
 */
export const roundToDecimals = (value: number, decimals = 2): number => {
  const multiplier = 10 ** decimals;
  return Math.round(value * multiplier) / multiplier;
};

/**
 * Normalize an angle to the range [-π, π]
 */
export const normalizeAngle = (angle: number): number =>
  ((angle + Math.PI) % (2 * Math.PI)) - Math.PI;
