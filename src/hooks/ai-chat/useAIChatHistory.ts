"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import {
  createConversation,
  deleteConversation,
  getConversationMessages,
  listConversations,
  renameConversation,
} from "@/lib/actions/ai-conversations";
import { useAuthStore, useChatStore } from "@/stores";
import type { AIConversation } from "@/types";

/**
 * Hook for AI chat history with multi-conversation support.
 */
export function useAIChatHistory() {
  const params = useParams<{ instanceId: string }>();
  const instanceId = params?.instanceId;

  const userId = useAuthStore((s) => s.user?.id);

  // State
  const state = useChatStore(
    useShallow((s) => ({
      conversationId: s.aiChat.conversationId,
      conversations: s.aiChat.conversations,
      initialMessages: s.aiChat.initialMessages,
      isLoadingConversations: s.aiChat.isLoadingConversations,
      isLoadingMessages: s.aiChat.isLoadingMessages,
    })),
  );

  // Actions
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

  const loadedKeyRef = useRef<string | null>(null);

  // Load conversations when userId or instanceId changes
  useEffect(() => {
    const key = userId && instanceId ? `${userId}:${instanceId}` : null;

    if (!key || loadedKeyRef.current === key) return;
    loadedKeyRef.current = key;

    const load = async () => {
      actions.setIsLoadingConversations(true);
      try {
        const result = await listConversations(instanceId);
        if (result.success) {
          actions.setConversations(result.data);
        }
      } finally {
        actions.setIsLoadingConversations(false);
      }
    };

    // Reset current selection when switching instances
    actions.setConversationId(null);
    actions.setInitialMessages([]);

    load();
  }, [userId, instanceId, actions]);

  // Load messages when conversation changes
  useEffect(() => {
    const conversationId = state.conversationId;
    if (!conversationId) {
      actions.setInitialMessages([]);
      return;
    }

    const load = async () => {
      actions.setIsLoadingMessages(true);
      try {
        const result = await getConversationMessages(conversationId);
        if (result.success) {
          actions.setInitialMessages(result.data);
        }
      } finally {
        actions.setIsLoadingMessages(false);
      }
    };

    load();
  }, [state.conversationId, actions]);

  // Actions
  const create = useCallback(
    async (title?: string): Promise<AIConversation | null> => {
      if (!instanceId) return null;
      const result = await createConversation(instanceId, title);
      if (!result.success) return null;
      actions.addConversation(result.data);
      actions.setConversationId(result.data.id);
      actions.setInitialMessages([]);
      return result.data;
    },
    [instanceId, actions],
  );

  const remove = useCallback(
    async (id: string): Promise<boolean> => {
      const result = await deleteConversation(id);
      if (!result.success) return false;
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
      const result = await renameConversation(id, title);
      if (!result.success) return false;
      actions.updateConversation(id, { title });
      return true;
    },
    [actions],
  );

  const select = useCallback(
    (id: string) => {
      if (id !== state.conversationId) {
        actions.setConversationId(id);
      }
    },
    [state.conversationId, actions],
  );

  const startNew = useCallback(() => {
    actions.setConversationId(null);
    actions.setInitialMessages([]);
  }, [actions]);

  return {
    instanceId,
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
