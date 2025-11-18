"use client";

import { useEffect } from "react";
import { Euler, Vector3 } from "three";
import { SYNC_PROVIDER } from "@/constants/sync";
import type { AnimationState } from "@/stores/localPlayerStore";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";
import { useRemotePlayersStore } from "@/stores/remotePlayersStore";
import { type Player, useColyseusState } from "@/utils/colyseus";
import {
  type LiveKitSyncEnvelope,
  subscribeToLiveKitMessages,
  subscribeToLiveKitParticipantLeft,
} from "@/utils/livekitClient";

const toVector3 = (value?: { x: number; y: number; z: number }) =>
  new Vector3(value?.x ?? 0, value?.y ?? 0, value?.z ?? 0);

const toEuler = (value?: { x: number; y: number; z: number }) =>
  new Euler(value?.x ?? 0, value?.y ?? 0, value?.z ?? 0);

export function useRemotePlayersSync() {
  useColyseusRemotePlayersSync(SYNC_PROVIDER === "colyseus");
  useLiveKitRemotePlayersSync(SYNC_PROVIDER === "livekit");
}

function useColyseusRemotePlayersSync(enabled: boolean) {
  const state = useColyseusState();
  const addOrUpdatePlayer = useRemotePlayersStore((s) => s.addOrUpdatePlayer);
  const removePlayer = useRemotePlayersStore((s) => s.removePlayer);

  useEffect(() => {
    if (!enabled || !state) return;

    const onAdd = (player: Player, key: string) => {
      if (!player || !player.position || !player.rotation) return;
      addOrUpdatePlayer(key, {
        sessionId: key,
        username: player.username,
        avatar: player.avatar,
        position: toVector3(player.position),
        rotation: toEuler(player.rotation),
        isRunning: player.isRunning as boolean,
        animation: player.animation as AnimationState,
      });
    };

    const onRemove = (_player: Player, key: string) => {
      removePlayer(key);
    };

    const onChange = (player: Player, key: string) => {
      if (!player || !player.position || !player.rotation) return;
      addOrUpdatePlayer(key, {
        avatar: player.avatar,
        position: toVector3(player.position),
        rotation: toEuler(player.rotation),
        isRunning: player.isRunning as boolean,
        animation: player.animation as AnimationState,
      });
    };

    const unsubAdd = state.players.onAdd(onAdd);
    const unsubRemove = state.players.onRemove(onRemove);
    const unsubChange = state.players.onChange(onChange);

    return () => {
      unsubAdd();
      unsubRemove();
      unsubChange();
    };
  }, [enabled, state, addOrUpdatePlayer, removePlayer]);
}

function useLiveKitRemotePlayersSync(enabled: boolean) {
  const addOrUpdatePlayer = useRemotePlayersStore((s) => s.addOrUpdatePlayer);
  const removePlayer = useRemotePlayersStore((s) => s.removePlayer);
  const clearAll = useRemotePlayersStore((s) => s.clearAll);
  const sessionId = useLocalPlayerStore((s) => s.sessionId);

  useEffect(() => {
    if (!enabled) {
      clearAll();
      return;
    }

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
  }, [enabled, addOrUpdatePlayer, removePlayer, clearAll, sessionId]);
}
