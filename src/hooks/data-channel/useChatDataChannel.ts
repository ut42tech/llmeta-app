import { useDataChannel } from "@livekit/components-react";
import { nanoid } from "nanoid";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { DATA_TOPICS } from "@/constants/sync";
import { useChatStore } from "@/stores/chatStore";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";
import type {
  ChatMessageImage,
  ChatMessagePacket,
  ReceivedDataMessage,
  TypingPacket,
} from "@/types";
import { decodePayload, encodePayload } from "@/utils/data-channel";

/**
 * Hook for chat data channels (messages + typing)
 */
export function useChatDataChannel(identity: string) {
  const { localSessionId, username } = useLocalPlayerStore(
    useShallow((s) => ({ localSessionId: s.sessionId, username: s.username })),
  );

  const {
    addIncomingMessage,
    addOutgoingMessage,
    updateMessageStatus,
    addTypingUser,
    removeTypingUser,
  } = useChatStore(
    useShallow((s) => ({
      addIncomingMessage: s.addIncomingMessage,
      addOutgoingMessage: s.addOutgoingMessage,
      updateMessageStatus: s.updateMessageStatus,
      addTypingUser: s.addTypingUser,
      removeTypingUser: s.removeTypingUser,
    })),
  );

  const handleChatMessage = useCallback(
    (msg: ReceivedDataMessage<typeof DATA_TOPICS.CHAT_MESSAGE>) => {
      const remoteId = msg.from?.identity || msg.from?.sid || "";
      const localId = localSessionId || identity;
      if (!remoteId || remoteId === localId) return;

      const data = decodePayload<ChatMessagePacket>(msg.payload);
      if (!data?.text && !data?.image) return;

      addIncomingMessage({
        id: data.id,
        sessionId: remoteId,
        username: data.username,
        content: data.text,
        sentAt: data.sentAt ?? Date.now(),
        image: data.image,
      });
    },
    [addIncomingMessage, identity, localSessionId],
  );

  const handleTypingMessage = useCallback(
    (msg: ReceivedDataMessage<typeof DATA_TOPICS.TYPING>) => {
      const remoteId = msg.from?.identity || msg.from?.sid || "";
      const localId = localSessionId || identity;
      if (!remoteId || remoteId === localId) return;

      const data = decodePayload<TypingPacket>(msg.payload);
      if (!data) return;

      if (data.isTyping) {
        addTypingUser(remoteId, data.username);
      } else {
        removeTypingUser(remoteId);
      }
    },
    [addTypingUser, identity, localSessionId, removeTypingUser],
  );

  const { send: sendChatPacket } = useDataChannel(
    DATA_TOPICS.CHAT_MESSAGE,
    handleChatMessage,
  );

  const { send: sendTypingPacket } = useDataChannel(
    DATA_TOPICS.TYPING,
    handleTypingMessage,
  );

  const sendChatMessage = useCallback(
    async (content: string, image?: ChatMessageImage) => {
      const text = content.trim();
      if (!text && !image) return;

      const messageId = nanoid();
      const payload: ChatMessagePacket = {
        id: messageId,
        text,
        username: username || undefined,
        sentAt: Date.now(),
        image,
      };

      addOutgoingMessage({
        id: payload.id,
        sessionId: localSessionId || identity,
        username: payload.username,
        content: payload.text,
        sentAt: payload.sentAt,
        image: payload.image,
      });

      try {
        await sendChatPacket(encodePayload(payload), {
          topic: DATA_TOPICS.CHAT_MESSAGE,
          reliable: true,
        });
        updateMessageStatus(messageId, "sent");
      } catch (error) {
        console.warn("[LiveKit] Failed to publish chat message", error);
        updateMessageStatus(messageId, "failed");
      }
    },
    [
      addOutgoingMessage,
      identity,
      localSessionId,
      sendChatPacket,
      updateMessageStatus,
      username,
    ],
  );

  const sendTyping = useCallback(
    (isTyping: boolean) => {
      const payload: TypingPacket = {
        username: username || undefined,
        isTyping,
      };
      sendTypingPacket(encodePayload(payload), {
        topic: DATA_TOPICS.TYPING,
        reliable: false,
      }).catch((e) => console.warn("[LiveKit] Failed to publish typing", e));
    },
    [sendTypingPacket, username],
  );

  return { sendChatMessage, sendTyping };
}
