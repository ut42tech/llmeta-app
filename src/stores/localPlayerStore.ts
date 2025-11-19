import { Euler, Vector3 } from "three";
import { create } from "zustand";
import { PERFORMANCE, PRECISION } from "@/constants/world";
import type { MoveData, ViverseAvatar } from "@/types/multiplayer";

const INITIAL_PLAYER_POSITION = new Vector3(0, 0, 0);
const INITIAL_PLAYER_ROTATION = new Euler(0, 0, 0);

/**
 * Convert a Vector3 to a plain object
 */
const toPlainVec3 = (
  v: Vector3 | Euler,
): { x: number; y: number; z: number } => {
  return { x: v.x, y: v.y, z: v.z };
};

/**
 * Round a number to the specified decimal places
 * @param value - The number to round
 * @param decimals - Number of decimal places (default: 2)
 * @returns Rounded number
 */
const roundToDecimals = (value: number, decimals = 2): number => {
  const multiplier = 10 ** decimals;
  return Math.round(value * multiplier) / multiplier;
};

/**
 * Build movement data from Vector3 and Euler (desktop)
 */
export function createMoveData(
  position: Vector3,
  rotation: Euler,
  isRunning: boolean,
  animation: string,
): MoveData {
  return {
    position: toPlainVec3(position),
    rotation: { x: rotation.x, y: rotation.y, z: 0 },
    isRunning: isRunning,
    animation: animation,
  };
}

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

type LocalPlayerState = {
  sessionId: string;
  // Player info
  username: string;

  // Avatar
  currentAvatar?: ViverseAvatar;
  avatarList?: ViverseAvatar[];

  // Position and rotation
  position: Vector3;
  rotation: Euler;

  // State
  isRunning: boolean;
  animationState: AnimationState;

  // View mode
  isFPV: boolean;

  // Teleport request handled by Scene (null = no pending teleport)
  pendingTeleport: { position: Vector3; rotation?: Euler } | null;

  // Last sent time (for throttling)
  lastSentTime: number;
};

type LocalPlayerActions = {
  setSessionId: (sessionId: string) => void;
  setUsername: (username: string) => void;
  setCurrentAvatar: (avatar: ViverseAvatar) => void;
  setAvatarList: (avatarList: ViverseAvatar[]) => void;
  setPosition: (position: Vector3) => void;
  setRotation: (rotation: Euler) => void;
  setIsRunning: (isRunning: boolean) => void;
  setAnimation: (state: AnimationState) => void;
  sendMovement: (publisher?: (data: MoveData) => void) => void;
  teleport: (position: Vector3, rotation?: Euler) => void;
  setIsFPV: (isFPV: boolean) => void;
  toggleFPV: () => void;
  reset: () => void;
};

type LocalPlayerStore = LocalPlayerState & LocalPlayerActions;

const initialState: LocalPlayerState = {
  sessionId: "",
  username: "Anonymous",
  position: INITIAL_PLAYER_POSITION.clone(),
  rotation: INITIAL_PLAYER_ROTATION.clone(),
  isRunning: false,
  animationState: "idle",
  isFPV: false,
  lastSentTime: 0,
  pendingTeleport: null,
};

export const useLocalPlayerStore = create<LocalPlayerStore>((set, get) => ({
  // State
  ...initialState,

  setSessionId: (sessionId: string) => {
    set({ sessionId });
  },

  setUsername: (username: string) => {
    set({ username });
  },

  // Avatar
  setCurrentAvatar: (avatar: ViverseAvatar) => {
    set({ currentAvatar: avatar });
  },

  setAvatarList: (avatarList: ViverseAvatar[]) => {
    set({ avatarList });
  },

  // Actions
  setPosition: (position: Vector3) => {
    const roundedPosition = position.clone();
    roundedPosition.x = roundToDecimals(
      roundedPosition.x,
      PRECISION.DECIMAL_PLACES,
    );
    roundedPosition.y = roundToDecimals(
      roundedPosition.y,
      PRECISION.DECIMAL_PLACES,
    );
    roundedPosition.z = roundToDecimals(
      roundedPosition.z,
      PRECISION.DECIMAL_PLACES,
    );
    set({ position: roundedPosition });
  },

  setRotation: (rotation: Euler) => {
    const normalizedRotation = rotation.clone();
    // Normalize rotation values to [-π, π] range
    normalizedRotation.x =
      ((normalizedRotation.x + Math.PI) % (2 * Math.PI)) - Math.PI;
    normalizedRotation.y =
      ((normalizedRotation.y + Math.PI) % (2 * Math.PI)) - Math.PI;
    normalizedRotation.z =
      ((normalizedRotation.z + Math.PI) % (2 * Math.PI)) - Math.PI;

    normalizedRotation.x = roundToDecimals(
      normalizedRotation.x,
      PRECISION.DECIMAL_PLACES,
    );
    normalizedRotation.y = roundToDecimals(
      normalizedRotation.y,
      PRECISION.DECIMAL_PLACES,
    );
    normalizedRotation.z = roundToDecimals(
      normalizedRotation.z,
      PRECISION.DECIMAL_PLACES,
    );
    set({ rotation: normalizedRotation });
  },

  setIsRunning: (isRunning: boolean) => {
    set({ isRunning });
  },

  setAnimation: (animationState: AnimationState) => {
    set({ animationState });
  },

  sendMovement: (publisher?: (data: MoveData) => void) => {
    const now = Date.now();
    const state = get();

    if (now - state.lastSentTime < PERFORMANCE.MOVEMENT_UPDATE_THROTTLE) {
      return;
    }

    if (!publisher) return;

    const moveData = createMoveData(
      state.position,
      state.rotation,
      state.isRunning,
      state.animationState,
    );
    publisher(moveData);
    set({ lastSentTime: now });
  },

  teleport: (position: Vector3, rotation?: Euler) => {
    set({ pendingTeleport: { position, rotation } });
  },

  setIsFPV: (isFPV: boolean) => set({ isFPV }),
  toggleFPV: () => set((s) => ({ isFPV: !s.isFPV })),

  reset: () => {
    set(initialState);
  },
}));
