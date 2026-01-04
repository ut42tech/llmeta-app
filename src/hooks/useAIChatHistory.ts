"use client";

import type { UIMessage } from "ai";
import { useCallback, useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useChatStore } from "@/stores/chatStore";
import { useWorldStore } from "@/stores/worldStore";

type MessageRole = "user" | "assistant" | "system";

type StoredMessage = {
  id: string;
  role: MessageRole;
  parts: unknown[];
  createdAt: string;
};

const toUIMessages = (messages: StoredMessage[]): UIMessage[] =>
  messages.map((m) => ({
    id: m.id,
    role: m.role,
    parts: m.parts as UIMessage["parts"],
  }));

/**
 * Hook for AI chat history management.
 *
 * Messages are now saved on the server side in the API route's onFinish callback.
 * This hook handles:
 * - Loading initial messages from database
 * - Creating conversations if needed
 * - Tracking message timestamps
 */
export function useAIChatHistory() {
  const userId = useAuthStore((s) => s.user?.id);
  const instanceId = useWorldStore((s) => s.instanceId);
  const conversationId = useChatStore((s) => s.aiChat.conversationId);
  const setConversationId = useChatStore((s) => s.setAIConversationId);

  const loadedKeyRef = useRef<string | null>(null);
  const initialMessagesRef = useRef<UIMessage[]>([]);
  const timestampsRef = useRef(new Map<string, string>());

  // Load history on mount or when instance changes
  useEffect(() => {
    const key = `${userId}-${instanceId}`;
    if (!userId || loadedKeyRef.current === key) return;

    (async () => {
      try {
        const params = instanceId ? `?instanceId=${instanceId}` : "";
        const res = await fetch(`/api/ai/conversations${params}`);
        if (!res.ok) return;

        const { conversationId: id, messages } = await res.json();
        setConversationId(id);
        initialMessagesRef.current = toUIMessages(messages);
        loadedKeyRef.current = key;
      } catch {
        /* ignore */
      }
    })();
  }, [userId, instanceId, setConversationId]);

  const ensureConversation = useCallback(async () => {
    if (conversationId) return conversationId;

    try {
      const res = await fetch("/api/ai/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instanceId }),
      });
      if (!res.ok) return null;

      const { conversationId: id } = await res.json();
      setConversationId(id);
      return id;
    } catch {
      return null;
    }
  }, [conversationId, instanceId, setConversationId]);

  useEffect(() => {
    if (userId && !conversationId) {
      ensureConversation();
    }
  }, [userId, conversationId, ensureConversation]);

  const recordMessageTime = useCallback((messageId: string) => {
    if (!timestampsRef.current.has(messageId)) {
      timestampsRef.current.set(messageId, new Date().toISOString());
    }
  }, []);

  return {
    conversationId,
    initialMessages: initialMessagesRef.current,
    recordMessageTime,
  };
}
