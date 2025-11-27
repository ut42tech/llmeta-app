import { create } from "zustand";

interface AIChatState {
  isOpen: boolean;
  includeChatHistory: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  toggleChatHistory: () => void;
  setIncludeChatHistory: (value: boolean) => void;
}

export const useAIChatStore = create<AIChatState>((set) => ({
  isOpen: false,
  includeChatHistory: true,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggleChatHistory: () =>
    set((state) => ({ includeChatHistory: !state.includeChatHistory })),
  setIncludeChatHistory: (value) => set({ includeChatHistory: value }),
}));
