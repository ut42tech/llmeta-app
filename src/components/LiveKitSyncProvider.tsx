"use client";

import {
  LiveKitRoom,
  useConnectionState,
  useDataChannel,
  useRoomContext,
} from "@livekit/components-react";
import type { Participant, RemoteParticipant } from "livekit-client";
import {
  ConnectionState as LiveKitConnectionState,
  RoomEvent,
} from "livekit-client";
import type { PropsWithChildren, ReactNode } from "react";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Euler, Vector3 } from "three";
import { DATA_TOPICS, LIVEKIT_CONFIG } from "@/constants/sync";
import { useConnectionStore } from "@/stores/connectionStore";
import type { AnimationState } from "@/stores/localPlayerStore";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";
import { useRemotePlayersStore } from "@/stores/remotePlayersStore";
import type { MoveData, ProfileData } from "@/types/multiplayer";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const noop = () => {};

type LiveKitSyncContextValue = {
  sessionId?: string;
  isConnected: boolean;
  sendMove: (payload: MoveData) => void;
  sendProfile: (payload: ProfileData) => void;
};

type ReceivedDataMessage<T extends string> = {
  topic?: T;
  payload: Uint8Array;
  from?: Participant;
};

type AuthState = {
  token?: string;
  serverUrl?: string;
};

const defaultContextValue: LiveKitSyncContextValue = {
  sessionId: undefined,
  isConnected: false,
  sendMove: noop,
  sendProfile: noop,
};

export const LiveKitSyncContext =
  createContext<LiveKitSyncContextValue>(defaultContextValue);

type ProviderProps = PropsWithChildren<{ roomName?: string }>;

export function LiveKitSyncProvider({
  children,
  roomName = LIVEKIT_CONFIG.defaultRoom,
}: ProviderProps) {
  const identityRef = useRef<string>(createIdentity());
  const setFailed = useConnectionStore((state) => state.setFailed);
  const [authState, setAuthState] = useState<AuthState>(() => ({
    serverUrl: LIVEKIT_CONFIG.wsUrl || undefined,
  }));

  useEffect(() => {
    let cancelled = false;

    const fetchToken = async () => {
      const identity = identityRef.current;
      if (!identity) {
        return;
      }

      try {
        const params = new URLSearchParams({
          identity,
          roomName,
        });
        const latestUsername = useLocalPlayerStore.getState().username;
        if (latestUsername) {
          params.set("name", latestUsername);
        }

        const response = await fetch(
          `${LIVEKIT_CONFIG.tokenEndpoint}?${params.toString()}`,
          { cache: "no-store" },
        );
        if (!response.ok) {
          const message = await response.text();
          throw new Error(
            message || `Failed to fetch LiveKit token (${response.status})`,
          );
        }

        const payload = (await response.json()) as {
          accessToken?: string;
          token?: string;
          serverUrl?: string;
        };

        const accessToken = payload.accessToken || payload.token;
        const serverUrl = LIVEKIT_CONFIG.wsUrl || payload.serverUrl;

        if (!accessToken || !serverUrl) {
          throw new Error("Token response missing accessToken/serverUrl");
        }

        if (cancelled) {
          return;
        }

        setAuthState({
          token: accessToken,
          serverUrl,
        });
      } catch (error) {
        if (cancelled) {
          return;
        }
        const message =
          error instanceof Error ? error.message : "Unknown token error";
        setFailed(message);
      }
    };

    fetchToken();

    return () => {
      cancelled = true;
    };
  }, [roomName, setFailed]);

  if (!authState.token || !authState.serverUrl) {
    return (
      <LiveKitSyncContext.Provider value={defaultContextValue}>
        {children}
      </LiveKitSyncContext.Provider>
    );
  }

  return (
    <LiveKitRoom
      token={authState.token}
      serverUrl={authState.serverUrl}
      connect={Boolean(authState.token)}
      audio={false}
      video={false}
      screen={false}
      onError={(error) => setFailed(error.message)}
    >
      <LiveKitSyncBridge identity={identityRef.current}>
        {children}
      </LiveKitSyncBridge>
    </LiveKitRoom>
  );
}

type BridgeProps = {
  identity: string;
  children: ReactNode;
};

const LiveKitSyncBridge = ({ identity, children }: BridgeProps) => {
  const room = useRoomContext();
  const connectionState = useConnectionState(room);
  const setConnecting = useConnectionStore((state) => state.setConnecting);
  const setConnected = useConnectionStore((state) => state.setConnected);
  const setDisconnected = useConnectionStore((state) => state.setDisconnected);

  const username = useLocalPlayerStore((state) => state.username);
  const currentAvatar = useLocalPlayerStore((state) => state.currentAvatar);
  const setSessionIdStore = useLocalPlayerStore((state) => state.setSessionId);

  const addOrUpdatePlayer = useRemotePlayersStore(
    (state) => state.addOrUpdatePlayer,
  );
  const removePlayer = useRemotePlayersStore((state) => state.removePlayer);
  const clearRemotePlayers = useRemotePlayersStore((state) => state.clearAll);

  const [sessionId, setSessionId] = useState<string | undefined>(identity);

  const handleMoveMessage = useCallback(
    (msg: ReceivedDataMessage<typeof DATA_TOPICS.MOVE>) => {
      const remoteIdentity = resolveIdentity(msg.from);
      if (!remoteIdentity || remoteIdentity === identity) {
        return;
      }

      const data = decodePayload<MoveData>(msg.payload);
      if (!data) {
        return;
      }

      addOrUpdatePlayer(remoteIdentity, {
        sessionId: remoteIdentity,
        position: toVector3(data.position),
        rotation: toEuler(data.rotation),
        isRunning: Boolean(data.isRunning),
        animation: (data.animation || "idle") as AnimationState,
      });
    },
    [addOrUpdatePlayer, identity],
  );

  const handleProfileMessage = useCallback(
    (msg: ReceivedDataMessage<typeof DATA_TOPICS.PROFILE>) => {
      const remoteIdentity = resolveIdentity(msg.from);
      if (!remoteIdentity || remoteIdentity === identity) {
        return;
      }

      const data = decodePayload<ProfileData>(msg.payload);
      if (!data) {
        return;
      }

      addOrUpdatePlayer(remoteIdentity, {
        sessionId: remoteIdentity,
        username: data.username,
        avatar: data.avatar,
      });
    },
    [addOrUpdatePlayer, identity],
  );

  const { send: sendMovePacket } = useDataChannel(
    DATA_TOPICS.MOVE,
    handleMoveMessage,
  );
  const { send: sendProfilePacket } = useDataChannel(
    DATA_TOPICS.PROFILE,
    handleProfileMessage,
  );

  const sendMove = useCallback(
    (payload: MoveData) => {
      const encoded = encoder.encode(JSON.stringify(payload));
      void sendMovePacket(encoded, {
        topic: DATA_TOPICS.MOVE,
        reliable: false,
      }).catch((error) => {
        console.warn("[LiveKit] Failed to publish move", error);
      });
    },
    [sendMovePacket],
  );

  const sendProfile = useCallback(
    (payload: ProfileData) => {
      const encoded = encoder.encode(JSON.stringify(payload));
      void sendProfilePacket(encoded, {
        topic: DATA_TOPICS.PROFILE,
        reliable: true,
      }).catch((error) => {
        console.warn("[LiveKit] Failed to publish profile", error);
      });
    },
    [sendProfilePacket],
  );

  useEffect(() => {
    if (connectionState === LiveKitConnectionState.Disconnected) {
      setSessionId(identity);
      setSessionIdStore(identity);
      return;
    }

    const newSessionId =
      room.localParticipant.identity || room.localParticipant.sid || identity;
    setSessionId(newSessionId);
    setSessionIdStore(newSessionId);
  }, [room, identity, setSessionIdStore, connectionState]);

  useEffect(() => {
    if (
      connectionState === LiveKitConnectionState.Connecting ||
      connectionState === LiveKitConnectionState.Reconnecting ||
      connectionState === LiveKitConnectionState.SignalReconnecting
    ) {
      setConnecting();
    } else if (connectionState === LiveKitConnectionState.Connected) {
      setConnected();
    } else if (connectionState === LiveKitConnectionState.Disconnected) {
      setDisconnected();
      clearRemotePlayers();
    }
  }, [
    connectionState,
    setConnecting,
    setConnected,
    setDisconnected,
    clearRemotePlayers,
  ]);

  useEffect(() => {
    const handleParticipantLeft = (participant: RemoteParticipant) => {
      const remoteIdentity = resolveIdentity(participant);
      if (remoteIdentity && remoteIdentity !== identity) {
        removePlayer(remoteIdentity);
      }
    };

    room.on(RoomEvent.ParticipantDisconnected, handleParticipantLeft);
    return () => {
      room.off(RoomEvent.ParticipantDisconnected, handleParticipantLeft);
    };
  }, [room, removePlayer, identity]);

  useEffect(() => {
    if (!sessionId || connectionState !== LiveKitConnectionState.Connected) {
      return;
    }

    sendProfile({
      username: username || undefined,
      avatar: currentAvatar,
    });
  }, [sessionId, connectionState, username, currentAvatar, sendProfile]);

  const contextValue = useMemo<LiveKitSyncContextValue>(
    () => ({
      sessionId,
      isConnected: connectionState === LiveKitConnectionState.Connected,
      sendMove,
      sendProfile,
    }),
    [sessionId, connectionState, sendMove, sendProfile],
  );

  return (
    <LiveKitSyncContext.Provider value={contextValue}>
      {children}
    </LiveKitSyncContext.Provider>
  );
};

const createIdentity = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

const decodePayload = <T,>(payload?: Uint8Array | null): T | null => {
  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(decoder.decode(payload)) as T;
  } catch (error) {
    console.warn("[LiveKit] Failed to decode data packet", error);
    return null;
  }
};

const resolveIdentity = (participant?: Participant | null) => {
  if (!participant) {
    return "";
  }
  return participant.identity || participant.sid || "";
};

const toVector3 = (value?: { x?: number; y?: number; z?: number }) =>
  new Vector3(value?.x ?? 0, value?.y ?? 0, value?.z ?? 0);

const toEuler = (value?: { x?: number; y?: number; z?: number }) =>
  new Euler(value?.x ?? 0, value?.y ?? 0, value?.z ?? 0);
