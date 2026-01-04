"use client";

import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { useSyncClient } from "@/hooks/livekit/useSyncClient";
import { useChatStore } from "@/stores/chatStore";
import type { ChatMessageImage } from "@/types/chat";

/**
 * Simplified text chat hook.
 */
export function useTextChat() {
  const { sendChatMessage, isConnected } = useSyncClient();
  const { messages, isOpen, setOpen } = useChatStore(
    useShallow((state) => ({
      messages: state.messages,
      isOpen: state.isOpen,
      setOpen: state.setOpen,
    })),
  );

  const handleSend = useCallback(
    async (content: string, image?: ChatMessageImage) => {
      if (!isConnected) return;
      await sendChatMessage(content, image);
    },
    [isConnected, sendChatMessage],
  );

  return {
    messages,
    isOpen,
    canSend: isConnected,
    setOpen,
    sendMessage: handleSend,
  };
}
