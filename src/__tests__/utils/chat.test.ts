import { describe, expect, it } from "vitest";
import type { ChatMessage } from "@/types/chat";
import { filterTextMessages, hasImageContent } from "@/utils/chat";

const createMessage = (overrides: Partial<ChatMessage> = {}): ChatMessage => ({
  id: "msg-1",
  senderId: "user-1",
  sessionId: "session-1",
  content: "Hello, world!",
  sentAt: new Date().toISOString(),
  isOwn: false,
  ...overrides,
});

describe("hasImageContent", () => {
  it("returns true when image URL exists", () => {
    const message = createMessage({
      image: { url: "https://example.com/image.png" },
    });
    expect(hasImageContent(message)).toBe(true);
  });

  it("returns true when image URL and prompt exist", () => {
    const message = createMessage({
      image: { url: "https://example.com/image.png", prompt: "A cat" },
    });
    expect(hasImageContent(message)).toBe(true);
  });

  it("returns false when no image exists", () => {
    const message = createMessage();
    expect(hasImageContent(message)).toBe(false);
  });

  it("returns false when image is undefined", () => {
    const message = createMessage({ image: undefined });
    expect(hasImageContent(message)).toBe(false);
  });

  it("returns false when URL is empty", () => {
    const message = createMessage({
      image: { url: "" },
    });
    expect(hasImageContent(message)).toBe(false);
  });
});

describe("filterTextMessages", () => {
  const now = Date.now();
  const ONE_MINUTE = 60 * 1000;

  const toISOString = (timestamp: number) => new Date(timestamp).toISOString();

  it("filters only messages with text content", () => {
    const messages = [
      createMessage({ id: "1", content: "Hello", sentAt: toISOString(now) }),
      createMessage({ id: "2", content: "", sentAt: toISOString(now) }),
      createMessage({ id: "3", content: "World", sentAt: toISOString(now) }),
    ];

    const result = filterTextMessages(messages, ONE_MINUTE * 10);
    expect(result).toHaveLength(2);
    expect(result.map((m) => m.id)).toEqual(["1", "3"]);
  });

  it("excludes expired messages", () => {
    const messages = [
      createMessage({ id: "1", content: "Recent", sentAt: toISOString(now) }),
      createMessage({
        id: "2",
        content: "Old",
        sentAt: toISOString(now - ONE_MINUTE * 5),
      }),
    ];

    const result = filterTextMessages(messages, ONE_MINUTE * 2);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("handles empty array correctly", () => {
    const result = filterTextMessages([], ONE_MINUTE);
    expect(result).toEqual([]);
  });

  it("excludes whitespace-only content", () => {
    const messages = [
      createMessage({ id: "1", content: "   ", sentAt: toISOString(now) }),
      createMessage({ id: "2", content: "\n\t", sentAt: toISOString(now) }),
      createMessage({ id: "3", content: "Valid", sentAt: toISOString(now) }),
    ];

    const result = filterTextMessages(messages, ONE_MINUTE * 10);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("3");
  });

  it("returns empty array when all messages are expired", () => {
    const messages = [
      createMessage({
        id: "1",
        content: "Old1",
        sentAt: toISOString(now - ONE_MINUTE * 10),
      }),
      createMessage({
        id: "2",
        content: "Old2",
        sentAt: toISOString(now - ONE_MINUTE * 20),
      }),
    ];

    const result = filterTextMessages(messages, ONE_MINUTE);
    expect(result).toEqual([]);
  });
});
