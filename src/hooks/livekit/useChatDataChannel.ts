import { nanoid } from "nanoid";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { DATA_TOPICS } from "@/constants/sync";
import { useTypedDataChannel } from "@/hooks/livekit/createTypedDataChannel";
import { useChatStore } from "@/stores/chatStore";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";
import type { ChatMessageImage, ChatMessagePacket } from "@/types/chat";

/**
 * Hook for chat data channel (messages only, typing removed for simplicity)
 */
export function useChatDataChannel(identity: string) {
  const { localSessionId, username } = useLocalPlayerStore(
    useShallow((s) => ({ localSessionId: s.sessionId, username: s.username })),
  );

  const { addIncomingMessage, addOutgoingMessage, updateMessageStatus } =
    useChatStore(
      useShallow((s) => ({
        addIncomingMessage: s.addIncomingMessage,
        addOutgoingMessage: s.addOutgoingMessage,
        updateMessageStatus: s.updateMessageStatus,
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

  return { sendChatMessage };
}
