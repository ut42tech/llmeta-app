/**
 * Grid-based world configuration
 */
export const GRID = {
  /** Size of each grid cell in world units */
  CELL_SIZE: 20,
  /** Half of the grid cell size (for centering calculations) */
  HALF_CELL_SIZE: 10,
};

export const PERFORMANCE = {
  MOVEMENT_UPDATE_THROTTLE: 50, // ms
  POSITION_LERP_FACTOR: 0.2,
  ROTATION_LERP_FACTOR: 0.2,
  ANIMATION_FADE_DURATION: 0.1,
};

// Interpolation and snapping constants
export const INTERPOLATION = {
  TARGET_FPS: 60,
  POSITION_EPSILON: 1e-4,
  ROTATION_EPSILON: 1e-4,
};

// Visual rotation offset
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
  LIGHT_OFFSET: { x: 2, y: 5, z: 2 },
  DIRECTIONAL_INTENSITY: 1.2,
  AMBIENT_INTENSITY: 1,
};

/**
 * Proximity-based voice chat configuration
 */
export const PROXIMITY_VOICE = {
  /** Maximum distance to hear another player's voice (world units) */
  MAX_HEARING_DISTANCE: 30,
  /** Distance where volume starts to fade out (world units) */
  FADE_START_DISTANCE: 15,
  /** Minimum volume level (0 = muted) */
  MIN_VOLUME: 0,
  /** Maximum volume level (1 = full volume) */
  MAX_VOLUME: 1,
  /** How often to update volume based on distance (milliseconds) */
  UPDATE_INTERVAL_MS: 100,
  /**
   * Rolloff factor for distance-based volume attenuation
   * - 1.0: Linear falloff
   * - 2.0: Quadratic falloff (more realistic, similar to inverse square law)
   * - 3.0: Cubic falloff (very steep)
   * Higher values create more natural audio spatialization
   */
  ROLLOFF_FACTOR: 2.0,
};
