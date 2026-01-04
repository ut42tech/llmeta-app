"use client";

import { useCallback } from "react";
import { useSyncClient } from "@/hooks/livekit/useSyncClient";
import { useChatStore } from "@/stores/chatStore";
import type { ChatMessageImage } from "@/types/chat";

/**
 * Simplified text chat hook.
 */
export function useTextChat() {
  const { sendChatMessage, isConnected } = useSyncClient();
  const messages = useChatStore((state) => state.messages);

  const handleSend = useCallback(
    async (content: string, image?: ChatMessageImage) => {
      if (!isConnected) return;
      await sendChatMessage(content, image);
    },
    [isConnected, sendChatMessage],
  );

  return {
    messages,
    canSend: isConnected,
    sendMessage: handleSend,
  };
}
