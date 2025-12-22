"use client";

import type {
  ConnectionState as LiveKitConnectionState,
  Room,
} from "livekit-client";
import { useContext } from "react";
import { LiveKitSyncContext } from "@/components/LiveKitSyncProvider";
import type { ChatMessageImage } from "@/types/chat";
import type { MoveData, ProfileData } from "@/types/player";

export type SyncClient = {
  sessionId?: string;
  isConnected: boolean;
  connectionState: LiveKitConnectionState;
  sendMove: (payload: MoveData) => void;
  sendProfile: (payload: ProfileData) => void;
  sendChatMessage: (content: string, image?: ChatMessageImage) => Promise<void>;
  room?: Room;
};

export function useSyncClient(): SyncClient {
  return useContext(LiveKitSyncContext);
}
