"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useChatStore } from "@/stores/chatStore";
import type { ChatMessage } from "@/types/chat";

type ApiMessage = {
  id: string;
  instance_id: string;
  sender_id: string | null;
  content: string | null;
  type: string;
  sent_at: string;
  profiles: { display_name: string } | null;
  message_images: Array<{ id: string; url: string; prompt: string | null }>;
};

/**
 * Hook to load chat history from Supabase on instance join.
 */
export function useChatHistory(instanceId: string | null) {
  const userId = useAuthStore((s) => s.user?.id);
  const setMessages = useChatStore((s) => s.setMessages);
  const loadedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!instanceId || loadedRef.current === instanceId) return;

    const loadHistory = async () => {
      try {
        const res = await fetch(
          `/api/messages?instanceId=${instanceId}&limit=100`,
        );
        if (!res.ok) throw new Error("Failed to fetch messages");

        const { messages } = (await res.json()) as { messages: ApiMessage[] };

        const chatMessages: ChatMessage[] = messages.map((msg) => ({
          id: msg.id,
          senderId: msg.sender_id || "system",
          username: msg.profiles?.display_name,
          content: msg.content || "",
          sentAt: msg.sent_at,
          image: msg.message_images[0]
            ? {
                url: msg.message_images[0].url,
                prompt: msg.message_images[0].prompt || undefined,
              }
            : undefined,
          isOwn: msg.sender_id === userId,
        }));

        setMessages(chatMessages);
        loadedRef.current = instanceId;
      } catch (error) {
        console.error("[ChatHistory] Failed to load:", error);
      }
    };

    loadHistory();
  }, [instanceId, setMessages, userId]);
}
