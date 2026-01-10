import { Euler, Vector3 } from "three";
import { create } from "zustand";
import { LIVEKIT_CONFIG } from "@/constants/sync";
import { PERFORMANCE, PRECISION } from "@/constants/world";
import type { AnimationState, MoveData, ViverseAvatar } from "@/types";
import { normalizeAngle, roundToDecimals } from "@/utils/math";
import { createMoveData } from "@/utils/player";

type LocalPlayerState = {
  sessionId: string;
  username: string;
  instanceId: string;
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
  setInstanceId: (instanceId: string) => void;
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

const roundToPrecision = (value: number): number =>
  roundToDecimals(value, PRECISION.DECIMAL_PLACES);

const roundPosition = (pos: Vector3): Vector3 =>
  pos
    .clone()
    .set(
      roundToPrecision(pos.x),
      roundToPrecision(pos.y),
      roundToPrecision(pos.z),
    );

const normalizeRotation = (rot: Euler): Euler =>
  rot
    .clone()
    .set(
      roundToPrecision(normalizeAngle(rot.x)),
      roundToPrecision(normalizeAngle(rot.y)),
      roundToPrecision(normalizeAngle(rot.z)),
      rot.order,
    );

const createInitialState = (): LocalPlayerState => ({
  sessionId: "",
  username: "Anonymous",
  instanceId: LIVEKIT_CONFIG.defaultInstanceId,
  position: new Vector3(),
  rotation: new Euler(),
  isRunning: false,
  animationState: "idle",
  isFPV: false,
  lastSentTime: 0,
  pendingTeleport: null,
  hasJoinedWorld: false,
});

export const useLocalPlayerStore = create<LocalPlayerStore>((set, get) => ({
  ...createInitialState(),

  setSessionId: (sessionId) => set({ sessionId }),
  setUsername: (username) => set({ username }),
  setInstanceId: (instanceId) => set({ instanceId }),
  setCurrentAvatar: (currentAvatar) => set({ currentAvatar }),
  setAvatarList: (avatarList) => set({ avatarList }),

  setPosition: (position) =>
    set((state) => {
      const rounded = roundPosition(position);
      return state.position.equals(rounded) ? {} : { position: rounded };
    }),

  setRotation: (rotation) =>
    set((state) => {
      const normalized = normalizeRotation(rotation);
      return state.rotation.equals(normalized) ? {} : { rotation: normalized };
    }),

  setIsRunning: (isRunning) => set({ isRunning }),
  setAnimation: (animationState) => set({ animationState }),

  sendMovement: (publisher) => {
    if (!publisher) return;

    const now = Date.now();
    const state = get();
    if (now - state.lastSentTime < PERFORMANCE.MOVEMENT_UPDATE_THROTTLE) return;

    publisher(
      createMoveData(
        state.position,
        state.rotation,
        state.isRunning,
        state.animationState,
      ),
    );
    set({ lastSentTime: now });
  },

  teleport: (position, rotation) =>
    set({ pendingTeleport: { position, rotation } }),
  setIsFPV: (isFPV) => set({ isFPV }),
  toggleFPV: () => set((s) => ({ isFPV: !s.isFPV })),
  setHasJoinedWorld: (hasJoinedWorld) => set({ hasJoinedWorld }),
  reset: () => set(createInitialState()),
}));
