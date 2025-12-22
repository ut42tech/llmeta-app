"use client";

import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { useSyncClient } from "@/hooks/livekit/useSyncClient";
import { useChatStore } from "@/stores/chatStore";
import type { ChatMessageImage } from "@/types/chat";

/**
 * Simplified text chat hook.
 * Removed: typing indicator, unread count (per user request for simplicity)
 */
export function useTextChat() {
  const { sendChatMessage, isConnected } = useSyncClient();

  const { messages, isOpen } = useChatStore(
    useShallow((state) => ({
      messages: state.messages,
      isOpen: state.isOpen,
    })),
  );

  const setOpen = useChatStore((state) => state.setOpen);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setOpen(open);
    },
    [setOpen],
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
    isOpen,
    canSend: isConnected,
    setOpen: handleOpenChange,
    sendMessage: handleSend,
  };
}
