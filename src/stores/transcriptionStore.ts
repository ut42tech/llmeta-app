import { nanoid } from "nanoid";
import { create } from "zustand";

/**
 * Maximum number of transcript entries to keep in history
 * Older entries are automatically removed to prevent memory bloat
 */
const MAX_HISTORY = 50;

type TranscriptEntry = {
  id: string;
  text: string;
  timestamp: number;
};

type TranscriptionState = {
  entries: TranscriptEntry[];
  partial?: string;
  isStreaming: boolean;
  error?: string;
  pendingAutoSend: string[];
};

type TranscriptionActions = {
  addEntry: (text: string) => void;
  setPartial: (text?: string) => void;
  setStreaming: (isStreaming: boolean) => void;
  setError: (message?: string) => void;
  consumePendingAutoSend: () => string[];
  reset: () => void;
};

type TranscriptionStore = TranscriptionState & TranscriptionActions;

const initialState: TranscriptionState = {
  entries: [],
  partial: undefined,
  isStreaming: false,
  error: undefined,
  pendingAutoSend: [],
};

export const useTranscriptionStore = create<TranscriptionStore>((set, get) => ({
  ...initialState,
  addEntry: (text) =>
    set((state) => {
      const trimmed = text.trim();
      if (!trimmed) {
        return state;
      }

      const nextEntry: TranscriptEntry = {
        id: nanoid(),
        text: trimmed,
        timestamp: Date.now(),
      };

      const nextEntries = [...state.entries, nextEntry];
      if (nextEntries.length > MAX_HISTORY) {
        nextEntries.splice(0, nextEntries.length - MAX_HISTORY);
      }

      return {
        entries: nextEntries,
        pendingAutoSend: [...state.pendingAutoSend, trimmed],
      };
    }),
  setPartial: (text) => set({ partial: text?.trim() || undefined }),
  setStreaming: (isStreaming) =>
    set((state) => ({
      isStreaming,
      partial: isStreaming ? state.partial : undefined,
    })),
  setError: (message) => set({ error: message }),

  consumePendingAutoSend: () => {
    const pending = get().pendingAutoSend;
    set({ pendingAutoSend: [] });
    return pending;
  },
  reset: () =>
    set(() => ({
      entries: [],
      partial: undefined,
      isStreaming: false,
      error: undefined,
      pendingAutoSend: [],
    })),
}));
