"use client";

import { useCallback } from "react";
import { useSyncClient } from "@/hooks";
import { useChatStore } from "@/stores";
import type { ChatMessageImage } from "@/types";

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
