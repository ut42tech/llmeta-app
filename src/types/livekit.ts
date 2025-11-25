import type { Participant } from "livekit-client";

/**
 * Data message received from LiveKit data channel
 */
export type ReceivedDataMessage<T extends string = string> = {
  topic?: T;
  payload: Uint8Array;
  from?: Participant;
};
