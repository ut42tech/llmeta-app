"use client";

import { useCallback } from "react";
import { SYNC_PROVIDER, type SyncProvider } from "@/constants/sync";
import { useConnectionStore } from "@/stores/connectionStore";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";
import {
  MessageType,
  type MoveData,
  type ProfileData,
  useColyseusRoom,
} from "@/utils/colyseus";
import {
  publishLiveKitMove,
  publishLiveKitProfile,
} from "@/utils/livekitClient";

export type SyncClient = {
  provider: SyncProvider;
  sessionId?: string;
  isConnected: boolean;
  sendMove?: (payload: MoveData) => void;
  sendProfile?: (payload: ProfileData) => void;
};

export function useSyncClient(): SyncClient {
  const room = useColyseusRoom();
  const sessionId = useLocalPlayerStore((state) => state.sessionId);
  const status = useConnectionStore((state) => state.status);

  const sendMove = useCallback(
    (payload: MoveData) => {
      if (SYNC_PROVIDER === "livekit") {
        publishLiveKitMove(payload);
        return;
      }
      room?.send(MessageType.MOVE, payload);
    },
    [room],
  );

  const sendProfile = useCallback(
    (payload: ProfileData) => {
      if (SYNC_PROVIDER === "livekit") {
        publishLiveKitProfile(payload);
        return;
      }
      room?.send(MessageType.CHANGE_PROFILE, payload);
    },
    [room],
  );

  return {
    provider: SYNC_PROVIDER,
    sessionId,
    isConnected: status === "connected",
    sendMove,
    sendProfile,
  };
}
