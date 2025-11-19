import type { Participant } from "livekit-client";
import { Euler, Vector3 } from "three";

const decoder = new TextDecoder();

export const decodePayload = <T>(payload?: Uint8Array | null): T | null => {
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

export const resolveIdentity = (participant?: Participant | null) => {
  if (!participant) {
    return "";
  }
  return participant.identity || participant.sid || "";
};

export const toVector3 = (value?: { x?: number; y?: number; z?: number }) =>
  new Vector3(value?.x ?? 0, value?.y ?? 0, value?.z ?? 0);

export const toEuler = (value?: { x?: number; y?: number; z?: number }) =>
  new Euler(value?.x ?? 0, value?.y ?? 0, value?.z ?? 0);
