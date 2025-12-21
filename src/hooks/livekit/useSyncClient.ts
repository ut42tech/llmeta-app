"use client";

import type { Room } from "livekit-client";
import { useContext } from "react";
import { LiveKitSyncContext } from "@/components/LiveKitSyncProvider";
import type { ChatMessageImage } from "@/types/chat";
import type { MoveData, ProfileData } from "@/types/player";

export type SyncClient = {
  sessionId?: string;
  isConnected: boolean;
  sendMove: (payload: MoveData) => void;
  sendProfile: (payload: ProfileData) => void;
  sendChatMessage: (content: string, image?: ChatMessageImage) => Promise<void>;
  sendTyping: (isTyping: boolean) => void;
  room?: Room;
};

export function useSyncClient(): SyncClient {
  return useContext(LiveKitSyncContext);
}
