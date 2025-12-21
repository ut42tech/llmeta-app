"use client";

import {
  LiveKitRoom,
  RoomAudioRenderer,
  useRoomContext,
} from "@livekit/components-react";
import {
  ConnectionState as LiveKitConnectionState,
  type Room,
  RoomEvent,
} from "livekit-client";
import type { PropsWithChildren, ReactNode } from "react";
import { createContext, useEffect, useMemo } from "react";
import { LIVEKIT_CONFIG } from "@/constants/sync";
import { useChatDataChannel } from "@/hooks/livekit/useChatDataChannel";
import { useLiveKitAuth } from "@/hooks/livekit/useLiveKitAuth";
import { useLiveKitConnection } from "@/hooks/livekit/useLiveKitConnection";
import { usePlayerDataChannel } from "@/hooks/livekit/usePlayerDataChannel";
import { useConnectionStore } from "@/stores/connectionStore";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";
import { useVoiceChatStore } from "@/stores/voiceChatStore";
import type { ChatMessageImage } from "@/types/chat";
import type { MoveData, ProfileData } from "@/types/player";

type LiveKitSyncContextValue = {
  sessionId?: string;
  isConnected: boolean;
  connectionState: LiveKitConnectionState;
  sendMove: (payload: MoveData) => void;
  sendProfile: (payload: ProfileData) => void;
  sendChatMessage: (content: string, image?: ChatMessageImage) => Promise<void>;
  sendTyping: (isTyping: boolean) => void;
  room?: Room;
};

const defaultContextValue: LiveKitSyncContextValue = {
  sessionId: undefined,
  isConnected: false,
  connectionState: LiveKitConnectionState.Disconnected,
  sendMove: () => void 0,
  sendProfile: () => void 0,
  sendChatMessage: async () => void 0,
  sendTyping: () => void 0,
  room: undefined,
};

export const LiveKitSyncContext =
  createContext<LiveKitSyncContextValue>(defaultContextValue);

type ProviderProps = PropsWithChildren<{ roomName?: string }>;

export function LiveKitSyncProvider({
  children,
  roomName = LIVEKIT_CONFIG.defaultRoom,
}: ProviderProps) {
  const setFailed = useConnectionStore((state) => state.setFailed);
  const { authState, identity } = useLiveKitAuth(roomName);

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
  const initKrisp = useVoiceChatStore((state) => state.initKrisp);

  const roomInstance = useRoomContext();
  const { sessionId, connectionState } = useLiveKitConnection(identity);
  const { sendMove, sendProfile } = usePlayerDataChannel(identity);
  const { sendChatMessage, sendTyping } = useChatDataChannel(identity);

  useEffect(() => {
    void initKrisp();
  }, [initKrisp]);

  useEffect(() => {
    if (!sessionId || connectionState !== LiveKitConnectionState.Connected) {
      return;
    }

    sendProfile({
      username: username || undefined,
      avatar: currentAvatar,
    });
  }, [sessionId, connectionState, username, currentAvatar, sendProfile]);

  useEffect(() => {
    if (!sessionId || connectionState !== LiveKitConnectionState.Connected) {
      return;
    }

    const handleParticipantConnected = () => {
      sendProfile({
        username: username || undefined,
        avatar: currentAvatar,
      });
    };

    roomInstance.on(RoomEvent.ParticipantConnected, handleParticipantConnected);

    return () => {
      roomInstance.off(
        RoomEvent.ParticipantConnected,
        handleParticipantConnected,
      );
    };
  }, [
    sessionId,
    connectionState,
    username,
    currentAvatar,
    sendProfile,
    roomInstance,
  ]);

  const contextValue = useMemo<LiveKitSyncContextValue>(
    () => ({
      sessionId,
      isConnected: connectionState === LiveKitConnectionState.Connected,
      connectionState,
      sendMove,
      sendProfile,
      sendChatMessage,
      sendTyping,
      room: roomInstance,
    }),
    [
      sessionId,
      connectionState,
      sendMove,
      sendProfile,
      sendChatMessage,
      sendTyping,
      roomInstance,
    ],
  );

  return (
    <LiveKitSyncContext.Provider value={contextValue}>
      {children}
    </LiveKitSyncContext.Provider>
  );
};
