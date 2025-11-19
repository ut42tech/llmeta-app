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
