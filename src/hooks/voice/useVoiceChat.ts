"use client";

import { useCallback, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useSyncClient } from "@/hooks/livekit/useSyncClient";
import { useConnectionStore } from "@/stores/connectionStore";
import {
  useVoiceChatStore,
  type VoicePermissionStatus,
} from "@/stores/voiceChatStore";

export type VoiceChatStatus = {
  isMicEnabled: boolean;
  isPublishing: boolean;
  permission: VoicePermissionStatus;
  error?: string;
  lastActiveAt?: number;
};

export function useVoiceChat() {
  const { room } = useSyncClient();
  const connectionStatus = useConnectionStore((state) => state.status);

  const { isMicEnabled, isPublishing, permission, error, lastActiveAt } =
    useVoiceChatStore(
      useShallow((state) => ({
        isMicEnabled: state.isMicEnabled,
        isPublishing: state.isPublishing,
        permission: state.permission,
        error: state.error,
        lastActiveAt: state.lastActiveAt,
      })),
    );

  const { enableMic, disableMic, toggleMic, reset } = useVoiceChatStore(
    useShallow((state) => ({
      enableMic: state.enableMic,
      disableMic: state.disableMic,
      toggleMic: state.toggleMic,
      reset: state.reset,
    })),
  );

  useEffect(() => {
    if (connectionStatus === "connected" && room) {
      return;
    }

    if (!room) {
      reset();
      return;
    }

    void (async () => {
      await disableMic(room);
      reset();
    })();
  }, [connectionStatus, room, disableMic, reset]);

  const handleEnable = useCallback(async () => {
    if (!room) return;
    await enableMic(room);
  }, [enableMic, room]);

  const handleDisable = useCallback(async () => {
    if (!room) return;
    await disableMic(room);
  }, [disableMic, room]);

  const handleToggle = useCallback(async () => {
    if (!room) return;
    await toggleMic(room);
  }, [toggleMic, room]);

  return {
    status: {
      isMicEnabled,
      isPublishing,
      permission,
      error,
      lastActiveAt,
    } satisfies VoiceChatStatus,
    enableMic: handleEnable,
    disableMic: handleDisable,
    toggleMic: handleToggle,
    canPublish: Boolean(room) && connectionStatus === "connected",
  };
}
