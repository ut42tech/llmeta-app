"use client";

import { useEffect } from "react";
import { Euler, Vector3 } from "three";
import type { AnimationState } from "@/stores/localPlayerStore";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";
import { useRemotePlayersStore } from "@/stores/remotePlayersStore";
import {
  type LiveKitSyncEnvelope,
  subscribeToLiveKitMessages,
  subscribeToLiveKitParticipantLeft,
} from "@/utils/livekit-client";

const toVector3 = (value?: { x: number; y: number; z: number }) =>
  new Vector3(value?.x ?? 0, value?.y ?? 0, value?.z ?? 0);

const toEuler = (value?: { x: number; y: number; z: number }) =>
  new Euler(value?.x ?? 0, value?.y ?? 0, value?.z ?? 0);

export function useRemotePlayersSync() {
  const addOrUpdatePlayer = useRemotePlayersStore((s) => s.addOrUpdatePlayer);
  const removePlayer = useRemotePlayersStore((s) => s.removePlayer);
  const clearAll = useRemotePlayersStore((s) => s.clearAll);
  const sessionId = useLocalPlayerStore((s) => s.sessionId);

  useEffect(() => {
    const handleMessage = (message: LiveKitSyncEnvelope) => {
      if (!message.sessionId || message.sessionId === sessionId) return;

      if (message.type === "MOVE") {
        addOrUpdatePlayer(message.sessionId, {
          sessionId: message.sessionId,
          position: toVector3(message.payload.position),
          rotation: toEuler(message.payload.rotation),
          isRunning: Boolean(message.payload.isRunning),
          animation: (message.payload.animation || "idle") as AnimationState,
        });
      }

      if (message.type === "CHANGE_PROFILE") {
        addOrUpdatePlayer(message.sessionId, {
          sessionId: message.sessionId,
          username: message.payload.username,
          avatar: message.payload.avatar,
        });
      }
    };

    const unsubMessages = subscribeToLiveKitMessages(handleMessage);
    const unsubLeft = subscribeToLiveKitParticipantLeft((identity) => {
      removePlayer(identity);
    });

    return () => {
      unsubMessages();
      unsubLeft();
      clearAll();
    };
  }, [addOrUpdatePlayer, removePlayer, clearAll, sessionId]);
}
