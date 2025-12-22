import type { AnimationState } from "@/types/player";

/**
 * Animation configuration for character movement
 */
export type AnimationConfig = {
  /** Animation state identifier */
  name: AnimationState;
  /** Path to the animation file */
  url: string;
  /** Time scale factor for the animation */
  scaleTime: number;
};

/**
 * URLs for jump animations from @react-three/viverse
 * These are re-exported for convenience
 */
export {
  IdleAnimationUrl,
  JumpDownAnimationUrl,
  JumpLoopAnimationUrl,
  JumpUpAnimationUrl,
} from "@react-three/viverse";

/**
 * Movement animation configurations
 * Used by both LocalCharacterAnimation and RemoteCharacterAnimation
 */
export const MOVEMENT_ANIMATIONS: readonly AnimationConfig[] = [
  {
    name: "forward",
    url: "/animations/jog-forward.glb",
    scaleTime: 1.5,
  },
  {
    name: "forwardRight",
    url: "/animations/jog-forward-right.glb",
    scaleTime: 1.5,
  },
  {
    name: "right",
    url: "/animations/jog-right.glb",
    scaleTime: 0.9,
  },
  {
    name: "backwardRight",
    url: "/animations/jog-backward-right.glb",
    scaleTime: 1.3,
  },
  {
    name: "backward",
    url: "/animations/jog-backward.glb",
    scaleTime: 1.4,
  },
  {
    name: "backwardLeft",
    url: "/animations/jog-backward-left.glb",
    scaleTime: 1.3,
  },
  {
    name: "left",
    url: "/animations/jog-left.glb",
    scaleTime: 0.9,
  },
  {
    name: "forwardLeft",
    url: "/animations/jog-forward-left.glb",
    scaleTime: 1.5,
  },
];

/**
 * Time scale multiplier when running
 */
export const RUN_TIME_SCALE = 2;

/**
 * Default time scale for walking
 */
export const WALK_TIME_SCALE = 1;
