import type { UIMessage } from "ai";
import { create } from "zustand";
import type { AIConversation, ChatMessage } from "@/types/chat";

const MAX_CHAT_MESSAGES = 200;

type AIChatState = {
  isOpen: boolean;
  conversationId: string | null;
  conversations: AIConversation[];
  initialMessages: UIMessage[];
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;
};

type ChatState = {
  messages: ChatMessage[];
  aiChat: AIChatState;
};

type ChatActions = {
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
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
  reset: () => void;
};

type ChatStore = ChatState & ChatActions;

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

/**
 * Unified chat store.
 * Messages are persisted to Supabase, real-time sync via LiveKit.
 */
export const useChatStore = create<ChatStore>((set) => ({
  ...initialState,

  setMessages: (messages) =>
    set({ messages: messages.slice(-MAX_CHAT_MESSAGES) }),

  addMessage: (message) =>
    set((state) => {
      // Skip if already exists
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

  reset: () => set(initialState),
}));
