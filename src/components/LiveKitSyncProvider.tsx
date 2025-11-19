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
import { AudioPermissionDialog } from "@/components/AudioPermissionDialog";
import { LIVEKIT_CONFIG } from "@/constants/sync";
import { useLiveKitAuth } from "@/hooks/useLiveKitAuth";
import { useLiveKitConnection } from "@/hooks/useLiveKitConnection";
import { useLiveKitDataChannels } from "@/hooks/useLiveKitDataChannels";
import { useConnectionStore } from "@/stores/connectionStore";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";
import { useVoiceChatStore } from "@/stores/voiceChatStore";
import type { MoveData, ProfileData } from "@/types/multiplayer";

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
      <AudioPermissionDialog />
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
  const { sendMove, sendProfile } = useLiveKitDataChannels(identity);

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
      {children}
    </LiveKitSyncContext.Provider>
  );
};
