import { create } from "zustand";
import type { ChatMessage } from "@/types/chat";

const MAX_CHAT_MESSAGES = 200;

type AIChatState = {
  isOpen: boolean;
};

type ChatState = {
  messages: ChatMessage[];
  isOpen: boolean;
  aiChat: AIChatState;
};

type ChatActions = {
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  setOpen: (isOpen: boolean) => void;
  toggleAIChat: () => void;
  openAIChat: () => void;
  closeAIChat: () => void;
  reset: () => void;
};

type ChatStore = ChatState & ChatActions;

const initialState: ChatState = {
  messages: [],
  isOpen: false,
  aiChat: {
    isOpen: false,
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

  setOpen: (isOpen) => set({ isOpen }),

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

  reset: () => set(initialState),
}));
