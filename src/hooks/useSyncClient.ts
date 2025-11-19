"use client";

import type { Room } from "livekit-client";
import { useContext } from "react";
import { LiveKitSyncContext } from "@/components/LiveKitSyncProvider";
import type { MoveData, ProfileData } from "@/types/multiplayer";

export type SyncClient = {
  sessionId?: string;
  isConnected: boolean;
  sendMove: (payload: MoveData) => void;
  sendProfile: (payload: ProfileData) => void;
  room?: Room;
};

export function useSyncClient(): SyncClient {
  return useContext(LiveKitSyncContext);
}
