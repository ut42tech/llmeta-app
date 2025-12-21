/**
 * LiveKit configuration and constants
 */

export const LIVEKIT_CONFIG = {
  tokenEndpoint: "/api/livekit/token",
  defaultRoom: process.env.LIVEKIT_ROOM || "playground",
  wsUrl: process.env.LIVEKIT_URL || "",
};

export const DATA_TOPICS = {
  MOVE: "player/move",
  PROFILE: "player/profile",
  CHAT_MESSAGE: "chat/message",
  TYPING: "chat/typing",
} as const;

export type DataTopic = (typeof DATA_TOPICS)[keyof typeof DATA_TOPICS];
