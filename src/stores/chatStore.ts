import { create } from "zustand";
import type { ChatMessage, ChatMessageStatus, TypingUser } from "@/types/chat";

const MAX_CHAT_MESSAGES = 200;
const TYPING_TIMEOUT_MS = 3000;

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
  typingUsers: Map<string, TypingUser>;
  typingTimeouts: Map<string, NodeJS.Timeout>;
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
  addTypingUser: (sessionId: string, username?: string) => void;
  removeTypingUser: (sessionId: string) => void;
  reset: () => void;
};

type ChatStore = ChatState & ChatActions;

const initialState: ChatState = {
  messages: [],
  unreadCount: 0,
  isOpen: false,
  typingUsers: new Map(),
  typingTimeouts: new Map(),
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

  addTypingUser: (sessionId, username) => {
    set((state) => {
      const existingTimeout = state.typingTimeouts.get(sessionId);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      const newTimeout = setTimeout(() => {
        set((s) => {
          const newTypingUsers = new Map(s.typingUsers);
          const newTimeouts = new Map(s.typingTimeouts);
          newTypingUsers.delete(sessionId);
          newTimeouts.delete(sessionId);
          return {
            typingUsers: newTypingUsers,
            typingTimeouts: newTimeouts,
          };
        });
      }, TYPING_TIMEOUT_MS);

      const newTypingUsers = new Map(state.typingUsers);
      const newTimeouts = new Map(state.typingTimeouts);
      newTypingUsers.set(sessionId, { sessionId, username });
      newTimeouts.set(sessionId, newTimeout);

      return {
        typingUsers: newTypingUsers,
        typingTimeouts: newTimeouts,
      };
    });
  },

  removeTypingUser: (sessionId) => {
    set((state) => {
      const existingTimeout = state.typingTimeouts.get(sessionId);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      const newTypingUsers = new Map(state.typingUsers);
      const newTimeouts = new Map(state.typingTimeouts);
      newTypingUsers.delete(sessionId);
      newTimeouts.delete(sessionId);

      return {
        typingUsers: newTypingUsers,
        typingTimeouts: newTimeouts,
      };
    });
  },

  reset: () => {
    set((state) => {
      state.typingTimeouts.forEach((timeout) => {
        clearTimeout(timeout);
      });
      return initialState;
    });
  },
}));
