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
import { JoinWorldDialog } from "@/components/JoinWorldDialog";
import { LIVEKIT_CONFIG } from "@/constants/sync";
import { useLiveKitAuth } from "@/hooks/livekit/useLiveKitAuth";
import { useLiveKitConnection } from "@/hooks/livekit/useLiveKitConnection";
import { usePlayerDataChannel } from "@/hooks/livekit/usePlayerDataChannel";
import { useRemoteProfileSync } from "@/hooks/livekit/useRemoteProfileSync";
import { useConnectionStore } from "@/stores/connectionStore";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";
import { useVoiceChatStore } from "@/stores/voiceChatStore";
import type { MoveData, ProfileData } from "@/types/player";

type LiveKitSyncContextValue = {
  sessionId?: string;
  isConnected: boolean;
  sendMove: (payload: MoveData) => void;
  sendProfile: (payload: ProfileData) => void;
  room?: Room;
};

const defaultContextValue: LiveKitSyncContextValue = {
  sessionId: undefined,
  isConnected: false,
  sendMove: () => void 0,
  sendProfile: () => void 0,
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
      <JoinWorldDialog />
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

  // Render remote profile sync component
  const RemoteProfileSyncComponent = useRemoteProfileSync();

  useEffect(() => {
    void initKrisp();
  }, [initKrisp]);

  // Sync local profile via Participant Attributes when connected or when profile changes
  useEffect(() => {
    if (!sessionId || connectionState !== LiveKitConnectionState.Connected) {
      return;
    }

    sendProfile({
      username: username || undefined,
      avatar: currentAvatar,
    });
  }, [sessionId, connectionState, username, currentAvatar, sendProfile]);

  // Note: No need for ParticipantConnected handler anymore
  // Participant Attributes are automatically synced to new participants by LiveKit

  const contextValue = useMemo<LiveKitSyncContextValue>(
    () => ({
      sessionId,
      isConnected: connectionState === LiveKitConnectionState.Connected,
      sendMove,
      sendProfile,
      room: roomInstance,
    }),
    [sessionId, connectionState, sendMove, sendProfile, roomInstance],
  );

  return (
    <LiveKitSyncContext.Provider value={contextValue}>
      {RemoteProfileSyncComponent}
      {children}
    </LiveKitSyncContext.Provider>
  );
};
