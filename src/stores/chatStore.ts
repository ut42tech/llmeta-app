import { create } from "zustand";
import type { ChatMessage, ChatMessageStatus } from "@/types/chat";

const MAX_CHAT_MESSAGES = 200;

const insertMessage = (
  messages: ChatMessage[],
  nextMessage: ChatMessage,
): ChatMessage[] => {
  const existingIndex = messages.findIndex((msg) => msg.id === nextMessage.id);
  if (existingIndex >= 0) {
    const updated = [...messages];
    updated[existingIndex] = {
      ...updated[existingIndex],
      ...nextMessage,
    };
    return updated;
  }

  const appended = [...messages, nextMessage];
  if (appended.length <= MAX_CHAT_MESSAGES) {
    return appended;
  }

  return appended.slice(appended.length - MAX_CHAT_MESSAGES);
};

type ChatState = {
  messages: ChatMessage[];
  unreadCount: number;
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
  markAllRead: () => void;
  reset: () => void;
};

type ChatStore = ChatState & ChatActions;

const initialState: ChatState = {
  messages: [],
  unreadCount: 0,
  isOpen: false,
};

export const useChatStore = create<ChatStore>((set) => ({
  ...initialState,

  addIncomingMessage: (message) => {
    const incoming: ChatMessage = {
      ...message,
      direction: "incoming",
      status: message.status ?? "sent",
    };

    set((state) => {
      const nextMessages = insertMessage(state.messages, incoming);
      const shouldIncrementUnread = !state.isOpen;
      return {
        messages: nextMessages,
        unreadCount: shouldIncrementUnread
          ? state.unreadCount + 1
          : state.unreadCount,
      };
    });
  },

  addOutgoingMessage: (message) => {
    const outgoing: ChatMessage = {
      ...message,
      direction: "outgoing",
      status: message.status ?? "pending",
    };

    set((state) => ({
      messages: insertMessage(state.messages, outgoing),
    }));
  },

  updateMessageStatus: (id, status) => {
    set((state) => {
      const index = state.messages.findIndex((msg) => msg.id === id);
      if (index === -1) {
        return state;
      }

      const updated = [...state.messages];
      updated[index] = { ...updated[index], status };
      return { messages: updated };
    });
  },

  setOpen: (isOpen) => {
    set((state) => ({
      isOpen,
      unreadCount: isOpen ? 0 : state.unreadCount,
    }));
  },

  markAllRead: () => {
    set(() => ({ unreadCount: 0 }));
  },

  reset: () => {
    set(initialState);
  },
}));
