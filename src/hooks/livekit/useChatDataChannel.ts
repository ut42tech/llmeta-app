import { nanoid } from "nanoid";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { DATA_TOPICS } from "@/constants/sync";
import { useTypedDataChannel } from "@/hooks/livekit/createTypedDataChannel";
import { useChatStore } from "@/stores/chatStore";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";
import type {
  ChatMessageImage,
  ChatMessagePacket,
  TypingPacket,
} from "@/types/chat";

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

  const effectiveIdentity = localSessionId || identity;

  // Chat message channel
  const handleChatMessage = useCallback(
    (data: ChatMessagePacket, senderId: string) => {
      if (!data?.text && !data?.image) return;

      addIncomingMessage({
        id: data.id,
        sessionId: senderId,
        username: data.username,
        content: data.text,
        sentAt: data.sentAt ?? Date.now(),
        image: data.image,
      });
    },
    [addIncomingMessage],
  );

  const { publishAsync: publishChatMessage } =
    useTypedDataChannel<ChatMessagePacket>({
      topic: DATA_TOPICS.CHAT_MESSAGE,
      identity: effectiveIdentity,
      onMessage: handleChatMessage,
    });

  // Typing indicator channel
  const handleTyping = useCallback(
    (data: TypingPacket, senderId: string) => {
      if (data.isTyping) {
        addTypingUser(senderId, data.username);
      } else {
        removeTypingUser(senderId);
      }
    },
    [addTypingUser, removeTypingUser],
  );

  const { publish: publishTyping } = useTypedDataChannel<TypingPacket>({
    topic: DATA_TOPICS.TYPING,
    identity: effectiveIdentity,
    onMessage: handleTyping,
  });

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
        sessionId: effectiveIdentity,
        username: payload.username,
        content: payload.text,
        sentAt: payload.sentAt,
        image: payload.image,
      });

      try {
        await publishChatMessage(payload, true);
        updateMessageStatus(messageId, "sent");
      } catch (error) {
        console.warn("[Chat] Failed to send message", error);
        updateMessageStatus(messageId, "failed");
      }
    },
    [
      addOutgoingMessage,
      effectiveIdentity,
      publishChatMessage,
      updateMessageStatus,
      username,
    ],
  );

  const sendTyping = useCallback(
    (isTyping: boolean) => {
      publishTyping({ username: username || undefined, isTyping }, false);
    },
    [publishTyping, username],
  );

  return { sendChatMessage, sendTyping };
}
