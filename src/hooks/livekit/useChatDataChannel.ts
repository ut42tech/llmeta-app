import { nanoid } from "nanoid";
import { useCallback } from "react";
import { DATA_TOPICS } from "@/constants/sync";
import { useTypedDataChannel } from "@/hooks/livekit/createTypedDataChannel";
import { useAuthStore, useChatStore, useLocalPlayerStore } from "@/stores";
import type { ChatMessage, ChatMessageImage, ChatMessagePacket } from "@/types";

/**
 * Hook for chat data channel.
 * - LiveKit: Real-time broadcast
 * - Supabase: Persistence (via API)
 */
export function useChatDataChannel(instanceId: string, identity: string) {
  const userId = useAuthStore((s) => s.user?.id);
  const sessionId = useLocalPlayerStore((s) => s.sessionId);
  const username = useLocalPlayerStore((s) => s.username);
  const addMessage = useChatStore((s) => s.addMessage);

  const handleChatMessage = useCallback(
    (data: ChatMessagePacket) => {
      if (!data?.content && !data?.image) return;

      const message: ChatMessage = {
        id: data.id,
        senderId: data.senderId,
        sessionId: data.sessionId,
        username: data.username,
        content: data.content,
        sentAt: data.sentAt,
        image: data.image,
        isOwn: data.senderId === userId,
      };

      addMessage(message);
    },
    [addMessage, userId],
  );

  const { publishAsync: publishChatMessage } =
    useTypedDataChannel<ChatMessagePacket>({
      topic: DATA_TOPICS.CHAT_MESSAGE,
      identity,
      onMessage: handleChatMessage,
    });

  const sendChatMessage = useCallback(
    async (content: string, image?: ChatMessageImage) => {
      const text = content.trim();
      if (!text && !image) return;
      if (!userId) return;

      const messageId = nanoid();
      const sentAt = new Date().toISOString();

      // Create message object
      const message: ChatMessage = {
        id: messageId,
        senderId: userId,
        sessionId,
        username: username || undefined,
        content: text,
        sentAt,
        image,
        isOwn: true,
      };

      // Add to local store immediately (optimistic)
      addMessage(message);

      // Create LiveKit packet (includes sessionId for player matching)
      const packet: ChatMessagePacket = {
        id: messageId,
        senderId: userId,
        sessionId,
        username: username || undefined,
        content: text,
        sentAt,
        image,
      };

      // Broadcast via LiveKit and persist to Supabase in parallel
      try {
        await Promise.all([
          publishChatMessage(packet, true),
          fetch("/api/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ instanceId, content: text, image }),
          }),
        ]);
      } catch (error) {
        console.warn("[Chat] Failed to send message", error);
      }
    },
    [addMessage, instanceId, publishChatMessage, sessionId, userId, username],
  );

  return { sendChatMessage };
}
