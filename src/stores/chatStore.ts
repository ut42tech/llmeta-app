import { create } from "zustand";
import type { ChatMessage, ChatMessageStatus, TypingUser } from "@/types/chat";
import type { EntityRecord } from "@/types/common";

const MAX_CHAT_MESSAGES = 200;
const TYPING_TIMEOUT_MS = 3000;

// Inline helpers (previously in stores/helpers.ts)
const upsertEntity = <T>(
  record: EntityRecord<T>,
  id: string,
  data: T,
): EntityRecord<T> => ({
  ...record,
  [id]: record[id] ? { ...record[id], ...data } : data,
});

const removeEntity = <T>(
  record: EntityRecord<T>,
  id: string,
): EntityRecord<T> => {
  const { [id]: _, ...rest } = record;
  return rest;
};

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
  unreadCount: number;
  isOpen: boolean;
  typingUsers: EntityRecord<TypingUser>;
  typingTimeouts: EntityRecord<NodeJS.Timeout>;
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
  typingUsers: {},
  typingTimeouts: {},
};

export const useChatStore = create<ChatStore>((set, get) => ({
  ...initialState,

  addIncomingMessage: (message) => {
    const incoming: ChatMessage = {
      ...message,
      direction: "incoming",
      status: message.status ?? "sent",
    };

    set((state) => ({
      messages: appendMessage(state.messages, incoming),
      unreadCount: state.isOpen ? state.unreadCount : state.unreadCount + 1,
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

  setOpen: (isOpen) => {
    set((state) => ({
      isOpen,
      unreadCount: isOpen ? 0 : state.unreadCount,
    }));
  },

  markAllRead: () => set({ unreadCount: 0 }),

  addTypingUser: (sessionId, username) => {
    const state = get();

    const existingTimeout = state.typingTimeouts[sessionId];
    if (existingTimeout) clearTimeout(existingTimeout);

    const timeout = setTimeout(() => {
      get().removeTypingUser(sessionId);
    }, TYPING_TIMEOUT_MS);

    set((s) => ({
      typingUsers: upsertEntity(s.typingUsers, sessionId, {
        sessionId,
        username,
      }),
      typingTimeouts: { ...s.typingTimeouts, [sessionId]: timeout },
    }));
  },

  removeTypingUser: (sessionId) => {
    const existingTimeout = get().typingTimeouts[sessionId];
    if (existingTimeout) clearTimeout(existingTimeout);

    set((state) => ({
      typingUsers: removeEntity(state.typingUsers, sessionId),
      typingTimeouts: removeEntity(state.typingTimeouts, sessionId),
    }));
  },

  reset: () => {
    const timeouts = get().typingTimeouts;
    for (const timeout of Object.values(timeouts)) {
      clearTimeout(timeout);
    }
    set(initialState);
  },
}));
