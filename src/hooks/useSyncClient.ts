"use client";

import { useCallback } from "react";
import { useConnectionStore } from "@/stores/connectionStore";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";
import type { MoveData, ProfileData } from "@/types/multiplayer";
import {
  publishLiveKitMove,
  publishLiveKitProfile,
} from "@/utils/livekit-client";

export type SyncClient = {
  sessionId?: string;
  isConnected: boolean;
  sendMove: (payload: MoveData) => void;
  sendProfile: (payload: ProfileData) => void;
};

export function useSyncClient(): SyncClient {
  const sessionId = useLocalPlayerStore((state) => state.sessionId);
  const status = useConnectionStore((state) => state.status);

  const sendMove = useCallback((payload: MoveData) => {
    publishLiveKitMove(payload);
  }, []);

  const sendProfile = useCallback((payload: ProfileData) => {
    publishLiveKitProfile(payload);
  }, []);

  return {
    sessionId,
    isConnected: status === "connected",
    sendMove,
    sendProfile,
  };
}
