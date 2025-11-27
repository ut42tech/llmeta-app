/**
 * Data channel message encoding/decoding utilities
 */

const encoder = new TextEncoder();
const decoder = new TextDecoder();

/**
 * Encode a payload for sending over data channel
 */
export const encodePayload = <T>(payload: T): Uint8Array =>
  encoder.encode(JSON.stringify(payload));

/**
 * Decode a payload received from data channel
 */
export const decodePayload = <T>(payload?: Uint8Array | null): T | null => {
  if (!payload) return null;
  try {
    return JSON.parse(decoder.decode(payload)) as T;
  } catch (error) {
    console.warn("[LiveKit] Failed to decode data packet", error);
    return null;
  }
};
