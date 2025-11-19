"use client";

import { useCallback, useEffect } from "react";
import { useSyncClient } from "@/hooks/useSyncClient";
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

  const isMicEnabled = useVoiceChatStore((state) => state.isMicEnabled);
  const isPublishing = useVoiceChatStore((state) => state.isPublishing);
  const permission = useVoiceChatStore((state) => state.permission);
  const error = useVoiceChatStore((state) => state.error);
  const lastActiveAt = useVoiceChatStore((state) => state.lastActiveAt);

  const enableMic = useVoiceChatStore((state) => state.enableMic);
  const disableMic = useVoiceChatStore((state) => state.disableMic);
  const toggleMic = useVoiceChatStore((state) => state.toggleMic);
  const reset = useVoiceChatStore((state) => state.reset);

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
  } as const;
}
