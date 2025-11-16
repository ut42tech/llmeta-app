export const GRID_CELL_SIZE = 10;
export const HALF_GRID_CELL_SIZE = GRID_CELL_SIZE / 2;

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
} as const;

// Visual rotation offset
export const ORIENTATION = {
  REMOTE_Y_OFFSET: Math.PI,
} as const;

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

// Character animation names
// Note: This replaces the removed simpleCharacterAnimationNames from @pmndrs/viverse
export const CHARACTER_ANIMATION_NAMES = [
  "idle",
  "walk",
  "run",
  "jumpUp",
  "jumpLoop",
  "jumpDown",
  "jumpForward",
] as const;

// Character animation symbols and utilities (re-exported from @pmndrs/viverse)
// Note: Use resolveDefaultCharacterAnimationUrl() to get actual URLs from these symbols
export {
  IdleAnimationUrl,
  JumpDownAnimationUrl,
  JumpForwardAnimationUrl,
  JumpLoopAnimationUrl,
  JumpUpAnimationUrl,
  RunAnimationUrl,
  resolveDefaultCharacterAnimationUrl,
  WalkAnimationUrl,
} from "@pmndrs/viverse";
