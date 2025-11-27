import type { Euler, Vector3 } from "three";
import type { Vec3 } from "./common";

/**
 * Avatar configuration from Viverse
 */
export type ViverseAvatar = {
  headIconUrl: string;
  id: number;
  vrmUrl: string;
};

/**
 * Profile data for network synchronization
 */
export type ProfileData = {
  username?: string;
  avatar?: ViverseAvatar;
};

/**
 * Movement data for network synchronization
 */
export type MoveData = {
  position?: Vec3;
  rotation?: Vec3;
  isRunning?: boolean;
  animation?: string;
};

/**
 * Animation states for character movement
 */
export type AnimationState =
  | "idle"
  | "forward"
  | "forwardRight"
  | "right"
  | "backwardRight"
  | "backward"
  | "backwardLeft"
  | "left"
  | "forwardLeft"
  | "jumpUp"
  | "jumpLoop"
  | "jumpDown";

/**
 * Remote player data stored in the state
 */
export type RemotePlayer = {
  sessionId: string;
  username: string;
  position: Vector3;
  rotation: Euler;
  isRunning: boolean;
  animation: AnimationState;
  avatar?: ViverseAvatar;
  isMuted: boolean;
  isSpeaking: boolean;
};
