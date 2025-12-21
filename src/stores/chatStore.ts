import { create } from "zustand";

/**
 * Chat UI state store.
 * Message management is handled by LiveKit's useChat hook.
 */
type ChatState = {
  unreadCount: number;
  isOpen: boolean;
};

type ChatActions = {
  setOpen: (isOpen: boolean) => void;
  markAllRead: () => void;
  incrementUnread: () => void;
  reset: () => void;
};

type ChatStore = ChatState & ChatActions;

const initialState: ChatState = {
  unreadCount: 0,
  isOpen: false,
};

export const useChatStore = create<ChatStore>((set) => ({
  ...initialState,

  setOpen: (isOpen) => {
    set((state) => ({
      isOpen,
      unreadCount: isOpen ? 0 : state.unreadCount,
    }));
  },

  markAllRead: () => set({ unreadCount: 0 }),

  incrementUnread: () =>
    set((state) => ({
      unreadCount: state.unreadCount + 1,
    })),

  reset: () => set(initialState),
}));
