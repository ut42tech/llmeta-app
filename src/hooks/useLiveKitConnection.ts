import { useConnectionState, useRoomContext } from "@livekit/components-react";
import type { RemoteParticipant } from "livekit-client";
import {
  ConnectionState as LiveKitConnectionState,
  RoomEvent,
} from "livekit-client";
import { useEffect, useState } from "react";
import { useChatStore } from "@/stores/chatStore";
import { useConnectionStore } from "@/stores/connectionStore";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";
import { useRemotePlayersStore } from "@/stores/remotePlayersStore";

export function useLiveKitConnection(identity: string) {
  const room = useRoomContext();
  const connectionState = useConnectionState(room);
  const setConnecting = useConnectionStore((state) => state.setConnecting);
  const setConnected = useConnectionStore((state) => state.setConnected);
  const setDisconnected = useConnectionStore((state) => state.setDisconnected);
  const setSessionIdStore = useLocalPlayerStore((state) => state.setSessionId);
  const removePlayer = useRemotePlayersStore((state) => state.removePlayer);
  const clearRemotePlayers = useRemotePlayersStore((state) => state.clearAll);
  const resetChat = useChatStore((state) => state.reset);

  const [sessionId, setSessionId] = useState<string | undefined>(identity);

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
      resetChat();
    }
  }, [
    connectionState,
    setConnecting,
    setConnected,
    setDisconnected,
    clearRemotePlayers,
    resetChat,
  ]);

  useEffect(() => {
    const handleParticipantLeft = (participant: RemoteParticipant) => {
      const remoteIdentity = participant?.identity || participant?.sid || "";
      if (remoteIdentity && remoteIdentity !== identity) {
        removePlayer(remoteIdentity);
      }
    };

    room.on(RoomEvent.ParticipantDisconnected, handleParticipantLeft);
    return () => {
      room.off(RoomEvent.ParticipantDisconnected, handleParticipantLeft);
    };
  }, [room, removePlayer, identity]);

  return { sessionId, connectionState };
}
