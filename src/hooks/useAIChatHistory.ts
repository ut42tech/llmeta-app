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

const serializePart = (part: UIMessage["parts"][number]): unknown | null => {
  switch (part.type) {
    case "text":
      return { type: "text", text: part.text };
    case "step-start":
      return null;
    default:
      if (part.type.startsWith("tool-")) {
        const { type, toolCallId, state, input, output } = part as Record<
          string,
          unknown
        >;
        return { type, toolCallId, state, input, output };
      }
      return null;
  }
};

const toStoredMessages = (
  messages: UIMessage[],
  timestamps: Map<string, string>,
): StoredMessage[] =>
  messages.map((m) => ({
    id: m.id,
    role: m.role,
    parts: m.parts.map(serializePart).filter(Boolean),
    createdAt: timestamps.get(m.id) ?? new Date().toISOString(),
  }));

const toUIMessages = (messages: StoredMessage[]): UIMessage[] =>
  messages.map((m) => ({
    id: m.id,
    role: m.role,
    parts: m.parts as UIMessage["parts"],
    createdAt: new Date(m.createdAt),
  }));

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

  // Create conversation if needed
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

  // Record timestamp when message first appears
  const recordMessageTime = useCallback((messageId: string) => {
    if (!timestampsRef.current.has(messageId)) {
      timestampsRef.current.set(messageId, new Date().toISOString());
    }
  }, []);

  // Save messages to database
  const saveMessages = useCallback(
    async (messages: UIMessage[]) => {
      const convId = await ensureConversation();
      if (!convId || !messages.length) return;

      try {
        await fetch("/api/ai/conversations", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId: convId,
            messages: toStoredMessages(messages, timestampsRef.current),
          }),
        });
      } catch {
        /* ignore */
      }
    },
    [ensureConversation],
  );

  return {
    conversationId,
    initialMessages: initialMessagesRef.current,
    recordMessageTime,
    saveMessages,
  };
}
