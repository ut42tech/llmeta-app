"use client";

import { useCallback, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useSyncClient } from "@/hooks/livekit/useSyncClient";
import { useChatStore } from "@/stores/chatStore";
import type { ChatMessageImage } from "@/types/chat";

export function useTextChat() {
  const { sendChatMessage, sendTyping, isConnected } = useSyncClient();

  const { messages, unreadCount, isOpen, typingUsers } = useChatStore(
    useShallow((state) => ({
      messages: state.messages,
      unreadCount: state.unreadCount,
      isOpen: state.isOpen,
      typingUsers: state.typingUsers,
    })),
  );

  const setOpen = useChatStore((state) => state.setOpen);
  const markAllRead = useChatStore((state) => state.markAllRead);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    markAllRead();
  }, [isOpen, markAllRead]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setOpen(open);
      if (open) {
        markAllRead();
      }
    },
    [markAllRead, setOpen],
  );

  const handleSend = useCallback(
    async (content: string, image?: ChatMessageImage) => {
      if (!isConnected) {
        return;
      }

      await sendChatMessage(content, image);
    },
    [isConnected, sendChatMessage],
  );

  return {
    messages,
    unreadCount,
    isOpen,
    canSend: isConnected,
    setOpen: handleOpenChange,
    sendMessage: handleSend,
    sendTyping,
    typingUsers,
  };
}
