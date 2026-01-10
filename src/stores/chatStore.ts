import type { UIMessage } from "ai";
import { create } from "zustand";
import type { AIConversation, ChatMessage } from "@/types";

// =============================================================================
// Constants
// =============================================================================

const MAX_CHAT_MESSAGES = 200;

// =============================================================================
// Types
// =============================================================================

type AIChatState = {
  isOpen: boolean;
  conversationId: string | null;
  conversations: AIConversation[];
  initialMessages: UIMessage[];
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;
};

type ChatState = {
  /** Real-time chat messages (LiveKit sync) */
  messages: ChatMessage[];
  /** AI chat assistant state */
  aiChat: AIChatState;
};

// =============================================================================
// Actions
// =============================================================================

type ChatActions = {
  // Real-time chat actions
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  // AI chat actions
  toggleAIChat: () => void;
  openAIChat: () => void;
  closeAIChat: () => void;
  setAIConversationId: (id: string | null) => void;
  setAIConversations: (conversations: AIConversation[]) => void;
  addAIConversation: (conversation: AIConversation) => void;
  removeAIConversation: (id: string) => void;
  updateAIConversation: (id: string, updates: Partial<AIConversation>) => void;
  setAIInitialMessages: (messages: UIMessage[]) => void;
  setIsLoadingConversations: (loading: boolean) => void;
  setIsLoadingMessages: (loading: boolean) => void;
  // Store reset
  reset: () => void;
};

type ChatStore = ChatState & ChatActions;

// =============================================================================
// Initial State
// =============================================================================

const initialState: ChatState = {
  messages: [],
  aiChat: {
    isOpen: false,
    conversationId: null,
    conversations: [],
    initialMessages: [],
    isLoadingConversations: false,
    isLoadingMessages: false,
  },
};

// =============================================================================
// Store
// =============================================================================

/**
 * Unified chat store.
 * - Real-time messages: persisted to Supabase, synced via LiveKit
 * - AI chat: conversation history with AI assistant
 */
export const useChatStore = create<ChatStore>((set) => ({
  ...initialState,

  // ---------------------------------------------------------------------------
  // Real-time Chat Actions
  // ---------------------------------------------------------------------------

  setMessages: (messages) =>
    set({ messages: messages.slice(-MAX_CHAT_MESSAGES) }),

  addMessage: (message) =>
    set((state) => {
      if (state.messages.some((m) => m.id === message.id)) {
        return state;
      }
      const appended = [...state.messages, message];
      return {
        messages:
          appended.length > MAX_CHAT_MESSAGES
            ? appended.slice(-MAX_CHAT_MESSAGES)
            : appended,
      };
    }),

  // ---------------------------------------------------------------------------
  // AI Chat Actions
  // ---------------------------------------------------------------------------

  toggleAIChat: () =>
    set((state) => ({
      aiChat: { ...state.aiChat, isOpen: !state.aiChat.isOpen },
    })),

  openAIChat: () =>
    set((state) => ({
      aiChat: { ...state.aiChat, isOpen: true },
    })),

  closeAIChat: () =>
    set((state) => ({
      aiChat: { ...state.aiChat, isOpen: false },
    })),

  setAIConversationId: (id) =>
    set((state) => ({
      aiChat: { ...state.aiChat, conversationId: id },
    })),

  setAIConversations: (conversations) =>
    set((state) => ({
      aiChat: { ...state.aiChat, conversations },
    })),

  addAIConversation: (conversation) =>
    set((state) => ({
      aiChat: {
        ...state.aiChat,
        conversations: [conversation, ...state.aiChat.conversations],
      },
    })),

  removeAIConversation: (id) =>
    set((state) => ({
      aiChat: {
        ...state.aiChat,
        conversations: state.aiChat.conversations.filter((c) => c.id !== id),
        conversationId:
          state.aiChat.conversationId === id
            ? null
            : state.aiChat.conversationId,
      },
    })),

  updateAIConversation: (id, updates) =>
    set((state) => ({
      aiChat: {
        ...state.aiChat,
        conversations: state.aiChat.conversations.map((c) =>
          c.id === id ? { ...c, ...updates } : c,
        ),
      },
    })),

  setAIInitialMessages: (messages) =>
    set((state) => ({
      aiChat: { ...state.aiChat, initialMessages: messages },
    })),

  setIsLoadingConversations: (loading) =>
    set((state) => ({
      aiChat: { ...state.aiChat, isLoadingConversations: loading },
    })),

  setIsLoadingMessages: (loading) =>
    set((state) => ({
      aiChat: { ...state.aiChat, isLoadingMessages: loading },
    })),

  // ---------------------------------------------------------------------------
  // Reset
  // ---------------------------------------------------------------------------

  reset: () => set(initialState),
}));
