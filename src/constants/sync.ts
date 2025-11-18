export type SyncProvider = "colyseus" | "livekit";

const DEFAULT_PROVIDER: SyncProvider = "colyseus";

/**
 * Active multiplayer sync provider (Colyseus or LiveKit).
 * Can be configured via NEXT_PUBLIC_SYNC_PROVIDER env.
 */
export const SYNC_PROVIDER: SyncProvider =
  (process.env.NEXT_PUBLIC_SYNC_PROVIDER as SyncProvider) || DEFAULT_PROVIDER;

export const LIVEKIT_CONFIG = {
  tokenEndpoint: "/api/livekit/token",
  defaultRoom: process.env.NEXT_PUBLIC_LIVEKIT_ROOM || "playground",
};
