"use client";

import {
  LiveKitRoom,
  RoomAudioRenderer,
  useRoomContext,
} from "@livekit/components-react";
import {
  ConnectionState as LiveKitConnectionState,
  type Room,
} from "livekit-client";
import type { PropsWithChildren, ReactNode } from "react";
import { createContext, useEffect, useMemo } from "react";
import { useChatHistory } from "@/hooks";
import { useChatDataChannel } from "@/hooks/livekit/useChatDataChannel";
import { useLiveKitAuth } from "@/hooks/livekit/useLiveKitAuth";
import { useLiveKitConnection } from "@/hooks/livekit/useLiveKitConnection";
import { useMovementDataChannel } from "@/hooks/livekit/useMovementDataChannel";
import { useParticipantProfile } from "@/hooks/livekit/useParticipantProfile";
import { useLocalPlayerStore, useWorldStore } from "@/stores";
import type { ChatMessageImage, MoveData, ProfileData } from "@/types";

// =============================================================================
// Types (exported for reuse in useSyncClient)
// =============================================================================

export type LiveKitSyncContextValue = {
  sessionId?: string;
  isConnected: boolean;
  connectionState: LiveKitConnectionState;
  sendMove: (payload: MoveData) => void;
  sendProfile: (payload: ProfileData) => void;
  sendChatMessage: (content: string, image?: ChatMessageImage) => Promise<void>;
  room?: Room;
};

// =============================================================================
// Context
// =============================================================================

const defaultContextValue: LiveKitSyncContextValue = {
  sessionId: undefined,
  isConnected: false,
  connectionState: LiveKitConnectionState.Disconnected,
  sendMove: () => void 0,
  sendProfile: () => void 0,
  sendChatMessage: async () => void 0,
  room: undefined,
};

export const LiveKitSyncContext =
  createContext<LiveKitSyncContextValue>(defaultContextValue);

type ProviderProps = PropsWithChildren<{ instanceId?: string }>;

export function LiveKitSyncProvider({
  children,
  instanceId: propInstanceId,
}: ProviderProps) {
  const storeInstanceId = useLocalPlayerStore((state) => state.instanceId);
  const instanceId = propInstanceId ?? storeInstanceId;
  const setFailed = useWorldStore((state) => state.setFailed);
  const { authState, identity } = useLiveKitAuth(instanceId);

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
      <RoomAudioRenderer />
      <LiveKitSyncBridge identity={identity}>{children}</LiveKitSyncBridge>
    </LiveKitRoom>
  );
}

type BridgeProps = {
  identity: string;
  children: ReactNode;
};

const LiveKitSyncBridge = ({ identity, children }: BridgeProps) => {
  const username = useLocalPlayerStore((state) => state.username);
  const currentAvatar = useLocalPlayerStore((state) => state.currentAvatar);
  const instanceId = useLocalPlayerStore((state) => state.instanceId);
  const setWorldInstanceId = useWorldStore((state) => state.setInstanceId);

  const roomInstance = useRoomContext();
  const { sessionId, connectionState } = useLiveKitConnection(identity);
  const { sendMove } = useMovementDataChannel(identity);
  const { setProfile } = useParticipantProfile();
  const { sendChatMessage } = useChatDataChannel(instanceId, identity);

  // Load chat history when connected
  useChatHistory(
    connectionState === LiveKitConnectionState.Connected ? instanceId : null,
  );

  useEffect(() => {
    if (connectionState === LiveKitConnectionState.Connected) {
      setWorldInstanceId(instanceId);
    } else {
      setWorldInstanceId(null);
    }
  }, [connectionState, instanceId, setWorldInstanceId]);

  useEffect(() => {
    if (!sessionId || connectionState !== LiveKitConnectionState.Connected) {
      return;
    }

    void setProfile({
      username: username || undefined,
      avatar: currentAvatar,
    });
  }, [sessionId, connectionState, username, currentAvatar, setProfile]);

  const sendProfile = useMemo(
    () => (payload: ProfileData) => {
      void setProfile(payload);
    },
    [setProfile],
  );

  const contextValue = useMemo<LiveKitSyncContextValue>(
    () => ({
      sessionId,
      isConnected: connectionState === LiveKitConnectionState.Connected,
      connectionState,
      sendMove,
      sendProfile,
      sendChatMessage,
      room: roomInstance,
    }),
    [
      sessionId,
      connectionState,
      sendMove,
      sendProfile,
      sendChatMessage,
      roomInstance,
    ],
  );

  return (
    <LiveKitSyncContext.Provider value={contextValue}>
      {children}
    </LiveKitSyncContext.Provider>
  );
};
