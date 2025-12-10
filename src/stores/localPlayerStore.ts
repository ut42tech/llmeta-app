import { Euler, Vector3 } from "three";
import { create } from "zustand";
import { PERFORMANCE, PRECISION } from "@/constants/world";
import type { AnimationState, MoveData, ViverseAvatar } from "@/types";
import { normalizeAngle, roundToDecimals } from "@/utils/math";
import { createMoveData } from "@/utils/player";

const INITIAL_POSITION = new Vector3(0, 0, 0);
const INITIAL_ROTATION = new Euler(0, 0, 0);

type LocalPlayerState = {
  sessionId: string;
  username: string;
  currentAvatar?: ViverseAvatar;
  avatarList?: ViverseAvatar[];
  position: Vector3;
  rotation: Euler;
  isRunning: boolean;
  animationState: AnimationState;
  isFPV: boolean;
  pendingTeleport: { position: Vector3; rotation?: Euler } | null;
  lastSentTime: number;
  hasJoinedWorld: boolean;
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
  setHasJoinedWorld: (hasJoined: boolean) => void;
  reset: () => void;
};

type LocalPlayerStore = LocalPlayerState & LocalPlayerActions;

const initialState: LocalPlayerState = {
  sessionId: "",
  username: "Anonymous",
  position: INITIAL_POSITION.clone(),
  rotation: INITIAL_ROTATION.clone(),
  isRunning: false,
  animationState: "idle",
  isFPV: false,
  lastSentTime: 0,
  pendingTeleport: null,
  hasJoinedWorld: false,
};

const roundPosition = (pos: Vector3): Vector3 => {
  const rounded = pos.clone();
  rounded.x = roundToDecimals(rounded.x, PRECISION.DECIMAL_PLACES);
  rounded.y = roundToDecimals(rounded.y, PRECISION.DECIMAL_PLACES);
  rounded.z = roundToDecimals(rounded.z, PRECISION.DECIMAL_PLACES);
  return rounded;
};

const normalizeRotation = (rot: Euler): Euler => {
  const normalized = rot.clone();
  normalized.x = roundToDecimals(
    normalizeAngle(normalized.x),
    PRECISION.DECIMAL_PLACES,
  );
  normalized.y = roundToDecimals(
    normalizeAngle(normalized.y),
    PRECISION.DECIMAL_PLACES,
  );
  normalized.z = roundToDecimals(
    normalizeAngle(normalized.z),
    PRECISION.DECIMAL_PLACES,
  );
  return normalized;
};

const isPositionEqual = (a: Vector3, b: Vector3): boolean =>
  a.x === b.x && a.y === b.y && a.z === b.z;

const isRotationEqual = (a: Euler, b: Euler): boolean =>
  a.x === b.x && a.y === b.y && a.z === b.z;

export const useLocalPlayerStore = create<LocalPlayerStore>((set, get) => ({
  ...initialState,

  setSessionId: (sessionId) => set({ sessionId }),
  setUsername: (username) => set({ username }),
  setCurrentAvatar: (currentAvatar) => set({ currentAvatar }),
  setAvatarList: (avatarList) => set({ avatarList }),

  setPosition: (position) => {
    const rounded = roundPosition(position);
    if (isPositionEqual(get().position, rounded)) return;
    set({ position: rounded });
  },

  setRotation: (rotation) => {
    const normalized = normalizeRotation(rotation);
    if (isRotationEqual(get().rotation, normalized)) return;
    set({ rotation: normalized });
  },

  setIsRunning: (isRunning) => set({ isRunning }),
  setAnimation: (animationState) => set({ animationState }),

  sendMovement: (publisher) => {
    const now = Date.now();
    const state = get();

    if (now - state.lastSentTime < PERFORMANCE.MOVEMENT_UPDATE_THROTTLE) return;
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

  teleport: (position, rotation) =>
    set({ pendingTeleport: { position, rotation } }),
  setIsFPV: (isFPV) => set({ isFPV }),
  toggleFPV: () => set((s) => ({ isFPV: !s.isFPV })),
  setHasJoinedWorld: (hasJoinedWorld) => set({ hasJoinedWorld }),
  reset: () => set(initialState),
}));
