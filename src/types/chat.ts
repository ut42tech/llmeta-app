import type { Tables } from "./supabase";

// =============================================================================
// Database Types
// =============================================================================

export type DbMessage = Tables<"messages">;
export type DbMessageImage = Tables<"message_images">;

// =============================================================================
// LiveKit Packet (for real-time sync)
// =============================================================================

export type ChatMessagePacket = {
  id: string;
  senderId: string; // Supabase user ID (for DB persistence)
  sessionId: string; // LiveKit session ID (for player matching)
  username?: string;
  content: string;
  sentAt: string;
  image?: {
    url: string;
    prompt?: string;
  };
};

// =============================================================================
// Client Types
// =============================================================================

export type ChatMessageImage = {
  url: string;
  prompt?: string;
};

export type ChatMessage = {
  id: string;
  senderId: string; // Supabase user ID
  sessionId?: string; // LiveKit session ID (only for real-time messages)
  username?: string;
  content: string;
  sentAt: string;
  image?: ChatMessageImage;
  isOwn: boolean;
};
