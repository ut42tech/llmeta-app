"use client";

import { useEffect, useRef } from "react";
import { AUTO_SEND_DEBOUNCE_MS } from "@/constants/transcription";
import { useTextChat } from "@/hooks/useTextChat";
import { useTranscriptionStore } from "@/stores/transcriptionStore";

/**
 * Automatically sends accumulated transcription results to chat after a debounce period.
 *
 * 1. Each finalized transcription entry is buffered in pendingAutoSend
 * 2. A debounce timer is reset on each new entry
 * 3. After AUTO_SEND_DEBOUNCE_MS of silence, all buffered text is combined and sent to chat
 *
 * @returns void - State is managed through Zustand stores
 */
export const useTranscriptionAutoSend = () => {
  const { sendMessage, canSend } = useTextChat();

  const pendingAutoSend = useTranscriptionStore(
    (state) => state.pendingAutoSend,
  );
  const consumePendingAutoSend = useTranscriptionStore(
    (state) => state.consumePendingAutoSend,
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear timer when can't send
    if (!canSend) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // No pending messages to send
    if (pendingAutoSend.length === 0) {
      return;
    }

    // Reset debounce timer on new pending message
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      const messages = consumePendingAutoSend();
      if (messages.length > 0) {
        const combined = messages.join(" ");
        void sendMessage(combined);
      }
      timerRef.current = null;
    }, AUTO_SEND_DEBOUNCE_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [canSend, pendingAutoSend, consumePendingAutoSend, sendMessage]);
};
