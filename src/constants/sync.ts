/**
 * LiveKit configuration and constants
 */

export const LIVEKIT_CONFIG = {
  tokenEndpoint: "/api/livekit/token",
  /** Default instance ID used when no instance is specified */
  defaultInstanceId: process.env.LIVEKIT_ROOM || "playground",
  wsUrl: process.env.LIVEKIT_URL || "",
};

export const DATA_TOPICS = {
  MOVE: "player/move",
  CHAT_MESSAGE: "chat/message",
} as const;
