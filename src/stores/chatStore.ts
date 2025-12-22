import { create } from "zustand";
import type { ChatMessage, ChatMessageStatus } from "@/types/chat";

const MAX_CHAT_MESSAGES = 200;

const appendMessage = (
  messages: ChatMessage[],
  message: ChatMessage,
): ChatMessage[] => {
  const existingIndex = messages.findIndex((msg) => msg.id === message.id);
  if (existingIndex >= 0) {
    const updated = [...messages];
    updated[existingIndex] = { ...updated[existingIndex], ...message };
    return updated;
  }

  const appended = [...messages, message];
  return appended.length > MAX_CHAT_MESSAGES
    ? appended.slice(-MAX_CHAT_MESSAGES)
    : appended;
};

type AIChatState = {
  isOpen: boolean;
  includeChatHistory: boolean;
};

type ChatState = {
  messages: ChatMessage[];
  isOpen: boolean;
  aiChat: AIChatState;
};

type ChatActions = {
  addIncomingMessage: (
    message: Omit<ChatMessage, "direction" | "status"> & {
      status?: ChatMessageStatus;
    },
  ) => void;
  addOutgoingMessage: (
    message: Omit<ChatMessage, "direction" | "status"> & {
      status?: ChatMessageStatus;
    },
  ) => void;
  updateMessageStatus: (id: string, status: ChatMessageStatus) => void;
  setOpen: (isOpen: boolean) => void;
  toggleAIChat: () => void;
  openAIChat: () => void;
  closeAIChat: () => void;
  toggleAIChatHistory: () => void;
  setAIChatIncludeHistory: (value: boolean) => void;
  reset: () => void;
};

type ChatStore = ChatState & ChatActions;

const initialState: ChatState = {
  messages: [],
  isOpen: false,
  aiChat: {
    isOpen: false,
    includeChatHistory: true,
  },
};

/**
 * Unified chat store.
 * Includes both text chat and AI chat state.
 */
export const useChatStore = create<ChatStore>((set) => ({
  ...initialState,

  addIncomingMessage: (message) => {
    const incoming: ChatMessage = {
      ...message,
      direction: "incoming",
      status: message.status ?? "sent",
    };

    set((state) => ({
      messages: appendMessage(state.messages, incoming),
    }));
  },

  addOutgoingMessage: (message) => {
    const outgoing: ChatMessage = {
      ...message,
      direction: "outgoing",
      status: message.status ?? "pending",
    };

    set((state) => ({
      messages: appendMessage(state.messages, outgoing),
    }));
  },

  updateMessageStatus: (id, status) => {
    set((state) => {
      const index = state.messages.findIndex((msg) => msg.id === id);
      if (index === -1) return state;

      const updated = [...state.messages];
      updated[index] = { ...updated[index], status };
      return { messages: updated };
    });
  },

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

  toggleAIChatHistory: () =>
    set((state) => ({
      aiChat: {
        ...state.aiChat,
        includeChatHistory: !state.aiChat.includeChatHistory,
      },
    })),

  setAIChatIncludeHistory: (value) =>
    set((state) => ({
      aiChat: { ...state.aiChat, includeChatHistory: value },
    })),

  reset: () => set(initialState),
}));
