import { useCallback, useEffect, useRef } from "react";

export function useTypingDebounce(
  isTyping: boolean,
  onTypingChange: (typing: boolean) => void,
  delay = 1500,
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(onTypingChange);

  useEffect(() => {
    callbackRef.current = onTypingChange;
  }, [onTypingChange]);

  useEffect(() => {
    // Always clear existing timer
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Always notify current state
    callbackRef.current(isTyping);

    // Only set timer when typing
    if (isTyping) {
      timeoutRef.current = setTimeout(() => callbackRef.current(false), delay);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isTyping, delay]);

  return useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    callbackRef.current(false);
  }, []);
}
