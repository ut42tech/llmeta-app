"use client";

import type { UIMessage } from "ai";
import { useCallback, useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { conversationsApi } from "@/lib/api/conversations";
import { useAuthStore } from "@/stores/authStore";
import { useChatStore } from "@/stores/chatStore";
import { useWorldStore } from "@/stores/worldStore";
import type { AIConversation, AIStoredMessage } from "@/types/chat";

const toUIMessages = (messages: AIStoredMessage[]): UIMessage[] =>
  messages.map((m) => ({
    id: m.id,
    role: m.role,
    parts: m.parts as UIMessage["parts"],
  }));

/**
 * Hook for AI chat history with multi-conversation support.
 */
export function useAIChatHistory() {
  const userId = useAuthStore((s) => s.user?.id);
  const instanceId = useWorldStore((s) => s.instanceId);

  // State (reactive)
  const state = useChatStore(
    useShallow((s) => ({
      conversationId: s.aiChat.conversationId,
      conversations: s.aiChat.conversations,
      initialMessages: s.aiChat.initialMessages,
      isLoadingConversations: s.aiChat.isLoadingConversations,
      isLoadingMessages: s.aiChat.isLoadingMessages,
    })),
  );

  // Actions (stable references from Zustand)
  const actions = useChatStore(
    useShallow((s) => ({
      setConversationId: s.setAIConversationId,
      setConversations: s.setAIConversations,
      setInitialMessages: s.setAIInitialMessages,
      addConversation: s.addAIConversation,
      removeConversation: s.removeAIConversation,
      updateConversation: s.updateAIConversation,
      setIsLoadingConversations: s.setIsLoadingConversations,
      setIsLoadingMessages: s.setIsLoadingMessages,
    })),
  );

  const loadedUserIdRef = useRef<string | null>(null);

  // Load conversations on user change
  useEffect(() => {
    if (!userId || loadedUserIdRef.current === userId) return;
    loadedUserIdRef.current = userId;

    void (async () => {
      actions.setIsLoadingConversations(true);
      actions.setConversations(await conversationsApi.list(instanceId));
      actions.setIsLoadingConversations(false);
    })();
  }, [userId, instanceId, actions]);

  // Load messages when conversation changes
  useEffect(() => {
    const id = state.conversationId;
    if (!id) {
      actions.setInitialMessages([]);
      return;
    }

    void (async () => {
      actions.setIsLoadingMessages(true);
      actions.setInitialMessages(
        toUIMessages(await conversationsApi.getMessages(id)),
      );
      actions.setIsLoadingMessages(false);
    })();
  }, [state.conversationId, actions]);

  // Actions
  const create = useCallback(
    async (title?: string): Promise<AIConversation | null> => {
      const conv = await conversationsApi.create(instanceId, title);
      if (!conv) return null;
      actions.addConversation(conv);
      actions.setConversationId(conv.id);
      actions.setInitialMessages([]);
      return conv;
    },
    [instanceId, actions],
  );

  const remove = useCallback(
    async (id: string): Promise<boolean> => {
      if (!(await conversationsApi.delete(id))) return false;
      actions.removeConversation(id);
      if (state.conversationId === id) {
        const next = state.conversations.find((c) => c.id !== id);
        actions.setConversationId(next?.id ?? null);
        if (!next) actions.setInitialMessages([]);
      }
      return true;
    },
    [state.conversationId, state.conversations, actions],
  );

  const rename = useCallback(
    async (id: string, title: string): Promise<boolean> => {
      if (!(await conversationsApi.updateTitle(id, title))) return false;
      actions.updateConversation(id, { title });
      return true;
    },
    [actions],
  );

  const select = useCallback(
    (id: string) => {
      if (id !== state.conversationId) actions.setConversationId(id);
    },
    [state.conversationId, actions],
  );

  const startNew = useCallback(() => {
    actions.setConversationId(null);
    actions.setInitialMessages([]);
  }, [actions]);

  return {
    conversationId: state.conversationId,
    conversations: state.conversations,
    initialMessages: state.initialMessages,
    isLoadingConversations: state.isLoadingConversations,
    isLoadingMessages: state.isLoadingMessages,
    create,
    remove,
    rename,
    select,
    startNew,
  };
}
