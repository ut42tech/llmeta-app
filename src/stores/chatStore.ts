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

type ChatState = {
  messages: ChatMessage[];
  isOpen: boolean;
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
  reset: () => void;
};

type ChatStore = ChatState & ChatActions;

const initialState: ChatState = {
  messages: [],
  isOpen: false,
};

/**
 * Simplified chat store.
 * Removed: typing indicators, unread count (per user request for simplicity)
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

  reset: () => set(initialState),
}));
