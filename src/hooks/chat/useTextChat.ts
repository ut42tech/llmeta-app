"use client";

import { useChat, useMaybeRoomContext } from "@livekit/components-react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { useSyncClient } from "@/hooks/livekit/useSyncClient";
import { useChatStore } from "@/stores/chatStore";
import type { ChatMessage, ChatMessageImage } from "@/types/chat";

/**
 * Hook for text chat functionality using LiveKit's native useChat.
 * Images are sent as JSON-stringified data in the message.
 *
 * This hook safely handles being called outside a LiveKitRoom context.
 * When no room is available, it returns empty messages and disabled send capability.
 */
export function useTextChat() {
  const { isConnected } = useSyncClient();
  const room = useMaybeRoomContext();

  // Only call useChat when we have a room context
  const chatResult = useChat({ room: room ?? undefined });

  // Extract values from chat result (safe even without room)
  const chatMessages = chatResult.chatMessages;
  const send = chatResult.send;
  const isSending = chatResult.isSending;

  const { unreadCount, isOpen } = useChatStore(
    useShallow((state) => ({
      unreadCount: state.unreadCount,
      isOpen: state.isOpen,
    })),
  );

  const setOpen = useChatStore((state) => state.setOpen);
  const markAllRead = useChatStore((state) => state.markAllRead);
  const incrementUnread = useChatStore((state) => state.incrementUnread);

  // Mark all as read when chat opens
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    markAllRead();
  }, [isOpen, markAllRead]);

  // Track new messages for unread count when chat is closed
  const prevMessageCount = useRef(chatMessages.length);
  useEffect(() => {
    // Only increment if we have MORE messages than before
    if (chatMessages.length > prevMessageCount.current && !isOpen) {
      incrementUnread();
    }
    prevMessageCount.current = chatMessages.length;
  }, [chatMessages.length, isOpen, incrementUnread]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setOpen(open);
      if (open) {
        markAllRead();
      }
    },
    [markAllRead, setOpen],
  );

  /**
   * Send a chat message.
   * If image is provided, it's encoded as JSON in the message.
   */
  const handleSend = useCallback(
    async (content: string, image?: ChatMessageImage) => {
      if (!isConnected || !room) return;

      // If we have an image, encode it with the message
      let messageText = content;
      if (image) {
        messageText = JSON.stringify({ text: content, image });
      }

      await send(messageText);
    },
    [isConnected, room, send],
  );

  // Transform LiveKit chat messages to our ChatMessage format
  const messages: ChatMessage[] = useMemo(() => {
    return chatMessages.map((msg) => {
      const isLocal = msg.from?.isLocal ?? false;
      let content = msg.message;
      let image: ChatMessageImage | undefined;

      // Try to parse as JSON for image messages
      try {
        const parsed = JSON.parse(msg.message) as {
          text?: string;
          image?: ChatMessageImage;
        };
        if (parsed.image) {
          content = parsed.text || "";
          image = parsed.image;
        }
      } catch {
        // Not JSON, use as-is
      }

      return {
        id: `${msg.timestamp}-${msg.from?.identity || "unknown"}`,
        sessionId: msg.from?.identity || "unknown",
        username: msg.from?.name || undefined,
        content,
        direction: isLocal ? "outgoing" : "incoming",
        status: "sent",
        sentAt: msg.timestamp,
        image,
      };
    });
  }, [chatMessages]);

  return {
    messages,
    unreadCount,
    isOpen,
    canSend: isConnected && !isSending && Boolean(room),
    setOpen: handleOpenChange,
    sendMessage: handleSend,
  };
}
