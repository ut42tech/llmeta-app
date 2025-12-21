/**
 * LiveKit configuration and constants
 */

export const LIVEKIT_CONFIG = {
  tokenEndpoint: "/api/livekit/token",
  defaultRoom: process.env.LIVEKIT_ROOM || "playground",
  wsUrl: process.env.LIVEKIT_URL || "",
};

/**
 * Data channel topics.
 * Note: Profile sync now uses Participant Attributes instead of data channels.
 * Chat now uses LiveKit's native useChat hook.
 */
export const DATA_TOPICS = {
  MOVE: "player/move",
} as const;

export type DataTopic = (typeof DATA_TOPICS)[keyof typeof DATA_TOPICS];
