"use client";

import { useEffect, useRef } from "react";
import { LIVEKIT_CONFIG } from "@/constants/sync";
import { useConnectionStore } from "@/stores/connectionStore";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";
import {
  connectToLiveKit,
  disconnectFromLiveKit,
  publishLiveKitProfile,
} from "@/utils/livekitClient";

const createIdentity = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

type LiveKitLifecycleOptions = {
  enabled?: boolean;
  roomName?: string;
};

export function useLiveKitLifecycle(options?: LiveKitLifecycleOptions) {
  const { enabled = true, roomName = LIVEKIT_CONFIG.defaultRoom } =
    options || {};
  const setConnecting = useConnectionStore((state) => state.setConnecting);
  const setConnected = useConnectionStore((state) => state.setConnected);
  const setFailed = useConnectionStore((state) => state.setFailed);
  const setDisconnected = useConnectionStore((state) => state.setDisconnected);
  const setSessionId = useLocalPlayerStore((state) => state.setSessionId);

  const username = useLocalPlayerStore((state) => state.username);
  const currentAvatar = useLocalPlayerStore((state) => state.currentAvatar);

  const identityRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!enabled) return;
    if (!identityRef.current) {
      identityRef.current = createIdentity();
    }
    let cancelled = false;

    const initialState = useLocalPlayerStore.getState();

    setConnecting();
    (async () => {
      try {
        const room = await connectToLiveKit({
          identity: identityRef.current as string,
          username: initialState.username,
          roomName,
          metadata: {
            username: initialState.username,
            avatarId: initialState.currentAvatar?.id,
          },
        });
        if (cancelled) return;
        const sessionId =
          room.localParticipant.identity ||
          room.localParticipant.sid ||
          identityRef.current;
        if (sessionId) {
          setSessionId(sessionId);
        }
        setConnected();
        publishLiveKitProfile({
          username: initialState.username || undefined,
          avatar: initialState.currentAvatar,
        });
      } catch (error) {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : String(error);
        setFailed(message);
      }
    })();

    return () => {
      cancelled = true;
      void disconnectFromLiveKit();
      setDisconnected();
    };
  }, [
    enabled,
    roomName,
    setConnecting,
    setConnected,
    setFailed,
    setDisconnected,
    setSessionId,
  ]);

  useEffect(() => {
    if (!enabled) return;
    if (!username && !currentAvatar) return;
    publishLiveKitProfile({
      username: username || undefined,
      avatar: currentAvatar,
    });
  }, [enabled, username, currentAvatar]);
}
