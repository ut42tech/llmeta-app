import type { Participant } from "livekit-client";

/**
 * Data message received from LiveKit data channel
 */
export type ReceivedDataMessage<T extends string = string> = {
  topic?: T;
  payload: Uint8Array;
  from?: Participant;
};

/**
 * Request payload for generating LiveKit access token
 */
export type LiveKitTokenRequest = {
  identity: string;
  name?: string;
  roomName?: string;
  metadata?: Record<string, unknown>;
  ttl?: number;
};

/**
 * Response from LiveKit token generation
 */
export type LiveKitTokenResponse = {
  token: string;
  serverUrl: string;
  roomName: string;
};
