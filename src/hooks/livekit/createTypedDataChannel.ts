/**
 * Factory for creating typed data channel hooks with shared logic.
 * Reduces boilerplate for encoding/decoding, error handling, and message filtering.
 */
import { useDataChannel } from "@livekit/components-react";
import { useCallback } from "react";

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
  } catch {
    return null;
  }
};

type DataChannelMessage = {
  payload: Uint8Array;
  from?: { identity?: string; sid?: string };
};

type UseTypedDataChannelConfig<TPayload> = {
  topic: string;
  identity: string;
  onMessage: (data: TPayload, senderId: string) => void;
};

/**
 * Creates a typed data channel hook with automatic encoding/decoding.
 */
export function useTypedDataChannel<TPayload>(
  config: UseTypedDataChannelConfig<TPayload>,
) {
  const { topic, identity, onMessage } = config;

  const handleMessage = useCallback(
    (msg: DataChannelMessage) => {
      const senderId = msg.from?.identity || msg.from?.sid || "";
      if (!senderId || senderId === identity) return;

      const data = decodePayload<TPayload>(msg.payload);
      if (data === null) return;

      onMessage(data, senderId);
    },
    [identity, onMessage],
  );

  const { send } = useDataChannel(topic, handleMessage);

  const publish = useCallback(
    (payload: TPayload, reliable = true) => {
      send(encodePayload(payload), { topic, reliable }).catch((e) =>
        console.warn(`[DataChannel] Failed to publish to ${topic}`, e),
      );
    },
    [send, topic],
  );

  const publishAsync = useCallback(
    async (payload: TPayload, reliable = true) => {
      await send(encodePayload(payload), { topic, reliable });
    },
    [send, topic],
  );

  return { publish, publishAsync };
}
