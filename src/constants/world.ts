/**
 * Grid-based world configuration
 */
export const GRID = {
  /** Size of each grid cell in world units */
  CELL_SIZE: 14.88,
  /** Half of the grid cell size (for centering calculations) */
  HALF_CELL_SIZE: 14.88 / 2,
};

export const PERFORMANCE = {
  MOVEMENT_UPDATE_THROTTLE: 50,
  POSITION_LERP_FACTOR: 0.2,
  ROTATION_LERP_FACTOR: 0.2,
  ANIMATION_FADE_DURATION: 0.1,
};

export const INTERPOLATION = {
  TARGET_FPS: 60,
  POSITION_EPSILON: 1e-4,
  ROTATION_EPSILON: 1e-4,
};

export const ORIENTATION = {
  REMOTE_Y_OFFSET: Math.PI,
};

export const PRECISION = {
  DECIMAL_PLACES: 2,
};

export const PHYSICS = {
  RESET_Y_THRESHOLD: -10,
};

export const LIGHTING = {
  LIGHT_OFFSET: { x: -2, y: 5, z: -2 },
  DIRECTIONAL_INTENSITY: 1.2,
  AMBIENT_INTENSITY: 1,
};
