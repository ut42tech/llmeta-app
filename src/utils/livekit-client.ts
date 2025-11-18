"use client";

import {
  ConnectionState,
  DataPacket_Kind,
  Room,
  RoomEvent,
} from "livekit-client";
import { LIVEKIT_CONFIG } from "@/constants/sync";
import type { MoveData, ProfileData } from "@/types/multiplayer";

export type LiveKitSyncMessageType = "MOVE" | "CHANGE_PROFILE";

export type LiveKitSyncEnvelope =
  | { type: "MOVE"; sessionId: string; payload: MoveData }
  | { type: "CHANGE_PROFILE"; sessionId: string; payload: ProfileData };

export type LiveKitConnectOptions = {
  identity: string;
  username?: string;
  roomName?: string;
  metadata?: Record<string, unknown>;
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

let cachedRoom: Room | undefined;
const messageListeners = new Set<(message: LiveKitSyncEnvelope) => void>();
const participantLeftListeners = new Set<(identity: string) => void>();

const parseEnvelope = (payload: Uint8Array): LiveKitSyncEnvelope | null => {
  try {
    const decoded = decoder.decode(payload);
    const data = JSON.parse(decoded) as LiveKitSyncEnvelope;
    if (!data?.type || !data?.sessionId) {
      return null;
    }
    return data;
  } catch (error) {
    console.warn("[LiveKit] Failed to parse data packet", error);
    return null;
  }
};

const notifyMessage = (message: LiveKitSyncEnvelope) => {
  for (const listener of messageListeners) {
    listener(message);
  }
};

const notifyParticipantLeft = (identity: string) => {
  for (const listener of participantLeftListeners) {
    listener(identity);
  }
};

const getLocalSessionId = () => {
  if (!cachedRoom) return undefined;
  return (
    cachedRoom.localParticipant.identity || cachedRoom.localParticipant.sid
  );
};

const publishEnvelope = (
  type: LiveKitSyncMessageType,
  payload: MoveData | ProfileData,
  kind: DataPacket_Kind,
) => {
  if (!cachedRoom || cachedRoom.state !== ConnectionState.Connected) return;
  const sessionId = getLocalSessionId();
  if (!sessionId) return;

  const envelope: LiveKitSyncEnvelope = {
    type: type,
    sessionId,
    payload: payload as never,
  } as LiveKitSyncEnvelope;

  try {
    const encoded = encoder.encode(JSON.stringify(envelope));
    const reliable = kind === DataPacket_Kind.RELIABLE;
    cachedRoom.localParticipant.publishData(encoded, { reliable });
  } catch (error) {
    console.warn("[LiveKit] Failed to publish data packet", error);
  }
};

export const connectToLiveKit = async (
  options: LiveKitConnectOptions,
): Promise<Room> => {
  if (cachedRoom && cachedRoom.state !== ConnectionState.Disconnected) {
    return cachedRoom;
  }

  const response = await fetch(LIVEKIT_CONFIG.tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identity: options.identity,
      name: options.username ?? "Anonymous",
      roomName: options.roomName ?? LIVEKIT_CONFIG.defaultRoom,
      metadata: options.metadata,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to acquire LiveKit token");
  }

  const { token, serverUrl } = (await response.json()) as {
    token: string;
    serverUrl: string;
  };

  const room = new Room({
    adaptiveStream: true,
    dynacast: true,
    disconnectOnPageLeave: false,
  });

  room.on(RoomEvent.DataReceived, (payload, participant) => {
    const envelope = parseEnvelope(payload);
    if (!envelope) return;
    if (!envelope.sessionId && participant) {
      envelope.sessionId = participant.identity || participant.sid || "";
    }
    notifyMessage(envelope);
  });

  room.on(RoomEvent.ParticipantDisconnected, (participant) => {
    const identity = participant.identity || participant.sid;
    if (identity) {
      notifyParticipantLeft(identity);
    }
  });

  room.on(RoomEvent.Disconnected, () => {
    cachedRoom = undefined;
  });

  await room.connect(serverUrl, token, { autoSubscribe: true });
  cachedRoom = room;
  return room;
};

export const disconnectFromLiveKit = async () => {
  if (cachedRoom) {
    cachedRoom.disconnect();
    cachedRoom = undefined;
  }
};

export const publishLiveKitMove = (payload: MoveData) => {
  publishEnvelope("MOVE", payload, DataPacket_Kind.LOSSY);
};

export const publishLiveKitProfile = (payload: ProfileData) => {
  publishEnvelope("CHANGE_PROFILE", payload, DataPacket_Kind.RELIABLE);
};

export const subscribeToLiveKitMessages = (
  listener: (message: LiveKitSyncEnvelope) => void,
) => {
  messageListeners.add(listener);
  return () => {
    messageListeners.delete(listener);
  };
};

export const subscribeToLiveKitParticipantLeft = (
  listener: (identity: string) => void,
) => {
  participantLeftListeners.add(listener);
  return () => {
    participantLeftListeners.delete(listener);
  };
};

export const getLiveKitRoom = () => cachedRoom;
