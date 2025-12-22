import type { ChatMessage } from "@/types/chat";

/**
 * Checks if a message has text content.
 * @param message - Chat message
 * @returns true if the message has text content
 */
function hasTextContent(message: ChatMessage): boolean {
  return Boolean(message.content && message.content.trim().length > 0);
}

/**
 * Checks if a message has image content.
 * @param message - Chat message
 * @returns true if the message has image content
 */
export function hasImageContent(message: ChatMessage): boolean {
  return Boolean(message.image?.url);
}

/**
 * Filters messages that have text content.
 * @param messages - Array of chat messages
 * @param maxAgeMs - Maximum age in milliseconds
 * @returns Array of messages with text content
 */
export function filterTextMessages(
  messages: ChatMessage[],
  maxAgeMs: number,
): ChatMessage[] {
  const now = Date.now();
  return messages.filter(
    (msg) => hasTextContent(msg) && now - msg.sentAt < maxAgeMs,
  );
}
