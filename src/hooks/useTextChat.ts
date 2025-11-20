"use client";

import { useCallback, useEffect } from "react";
import { useSyncClient } from "@/hooks/useSyncClient";
import { useChatStore } from "@/stores/chatStore";

export function useTextChat() {
  const { sendChatMessage, sendTyping, isConnected } = useSyncClient();
  const messages = useChatStore((state) => state.messages);
  const unreadCount = useChatStore((state) => state.unreadCount);
  const isOpen = useChatStore((state) => state.isOpen);
  const setOpen = useChatStore((state) => state.setOpen);
  const markAllRead = useChatStore((state) => state.markAllRead);
  const typingUsers = useChatStore((state) => state.typingUsers);

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
    async (content: string) => {
      if (!isConnected) {
        return;
      }

      await sendChatMessage(content);
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
  } as const;
}
