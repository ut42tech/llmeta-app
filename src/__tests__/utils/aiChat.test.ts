import { describe, expect, it } from "vitest";

// Types matching useAIChatHistory
type MessageRole = "user" | "assistant" | "system";

type StoredMessage = {
  id: string;
  role: MessageRole;
  parts: unknown[];
  createdAt: string;
};

type UIMessagePart =
  | { type: "text"; text: string }
  | { type: "step-start" }
  | {
      type: "tool-invocation";
      toolCallId: string;
      state: string;
      input: unknown;
      output?: unknown;
    }
  | {
      type: "tool-result";
      toolCallId: string;
      state: string;
      input: unknown;
      output: unknown;
    };

type UIMessage = {
  id: string;
  role: MessageRole;
  parts: UIMessagePart[];
  createdAt?: Date;
};

// Functions extracted from useAIChatHistory for testing
const serializePart = (part: UIMessagePart): unknown | null => {
  switch (part.type) {
    case "text":
      return { type: "text", text: part.text };
    case "step-start":
      return null;
    default:
      if (part.type.startsWith("tool-")) {
        const { type, toolCallId, state, input, output } = part as Record<
          string,
          unknown
        >;
        return { type, toolCallId, state, input, output };
      }
      return null;
  }
};

const toStoredMessages = (
  messages: UIMessage[],
  timestamps: Map<string, string>,
): StoredMessage[] =>
  messages.map((m) => ({
    id: m.id,
    role: m.role,
    parts: m.parts.map(serializePart).filter(Boolean),
    createdAt: timestamps.get(m.id) ?? new Date().toISOString(),
  }));

const toUIMessages = (messages: StoredMessage[]): UIMessage[] =>
  messages.map((m) => ({
    id: m.id,
    role: m.role,
    parts: m.parts as UIMessage["parts"],
    createdAt: new Date(m.createdAt),
  }));

describe("serializePart", () => {
  it("serializes text part", () => {
    const part: UIMessagePart = { type: "text", text: "Hello world" };
    expect(serializePart(part)).toEqual({ type: "text", text: "Hello world" });
  });

  it("filters out step-start part", () => {
    const part: UIMessagePart = { type: "step-start" };
    expect(serializePart(part)).toBe(null);
  });

  it("serializes tool-invocation part", () => {
    const part: UIMessagePart = {
      type: "tool-invocation",
      toolCallId: "call-123",
      state: "done",
      input: { query: "test" },
      output: { result: "success" },
    };
    expect(serializePart(part)).toEqual({
      type: "tool-invocation",
      toolCallId: "call-123",
      state: "done",
      input: { query: "test" },
      output: { result: "success" },
    });
  });

  it("serializes tool-result part", () => {
    const part: UIMessagePart = {
      type: "tool-result",
      toolCallId: "call-456",
      state: "done",
      input: { x: 1 },
      output: { y: 2 },
    };
    expect(serializePart(part)).toEqual({
      type: "tool-result",
      toolCallId: "call-456",
      state: "done",
      input: { x: 1 },
      output: { y: 2 },
    });
  });
});

describe("toStoredMessages", () => {
  it("converts UIMessages to stored format", () => {
    const timestamps = new Map([["msg-1", "2026-01-05T10:00:00.000Z"]]);
    const messages: UIMessage[] = [
      {
        id: "msg-1",
        role: "user",
        parts: [{ type: "text", text: "Hello" }],
      },
    ];

    const result = toStoredMessages(messages, timestamps);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: "msg-1",
      role: "user",
      parts: [{ type: "text", text: "Hello" }],
      createdAt: "2026-01-05T10:00:00.000Z",
    });
  });

  it("filters step-start from parts", () => {
    const timestamps = new Map<string, string>();
    const messages: UIMessage[] = [
      {
        id: "msg-1",
        role: "assistant",
        parts: [{ type: "step-start" }, { type: "text", text: "Response" }],
      },
    ];

    const result = toStoredMessages(messages, timestamps);

    expect(result[0].parts).toHaveLength(1);
    expect(result[0].parts[0]).toEqual({ type: "text", text: "Response" });
  });

  it("uses current time when timestamp not in map", () => {
    const timestamps = new Map<string, string>();
    const beforeTest = new Date().toISOString();

    const messages: UIMessage[] = [
      { id: "msg-new", role: "user", parts: [{ type: "text", text: "Hi" }] },
    ];

    const result = toStoredMessages(messages, timestamps);

    expect(result[0].createdAt).toBeDefined();
    expect(result[0].createdAt >= beforeTest).toBe(true);
  });

  it("handles multiple messages with mixed parts", () => {
    const timestamps = new Map([
      ["msg-1", "2026-01-05T10:00:00.000Z"],
      ["msg-2", "2026-01-05T10:01:00.000Z"],
    ]);

    const messages: UIMessage[] = [
      {
        id: "msg-1",
        role: "user",
        parts: [{ type: "text", text: "What is 2+2?" }],
      },
      {
        id: "msg-2",
        role: "assistant",
        parts: [
          { type: "step-start" },
          {
            type: "tool-invocation",
            toolCallId: "calc-1",
            state: "done",
            input: { a: 2, b: 2 },
            output: 4,
          },
          { type: "text", text: "The answer is 4" },
        ],
      },
    ];

    const result = toStoredMessages(messages, timestamps);

    expect(result).toHaveLength(2);
    expect(result[0].parts).toHaveLength(1);
    expect(result[1].parts).toHaveLength(2); // step-start filtered
  });
});

describe("toUIMessages", () => {
  it("converts stored messages to UIMessage format", () => {
    const stored: StoredMessage[] = [
      {
        id: "msg-1",
        role: "assistant",
        parts: [{ type: "text", text: "Hello!" }],
        createdAt: "2026-01-05T10:00:00.000Z",
      },
    ];

    const result = toUIMessages(stored);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("msg-1");
    expect(result[0].role).toBe("assistant");
    expect(result[0].parts).toEqual([{ type: "text", text: "Hello!" }]);
    expect(result[0].createdAt).toBeInstanceOf(Date);
    expect(result[0].createdAt?.toISOString()).toBe("2026-01-05T10:00:00.000Z");
  });

  it("handles empty parts array", () => {
    const stored: StoredMessage[] = [
      {
        id: "msg-1",
        role: "user",
        parts: [],
        createdAt: "2026-01-05T10:00:00.000Z",
      },
    ];

    const result = toUIMessages(stored);

    expect(result[0].parts).toEqual([]);
  });

  it("preserves tool call data", () => {
    const stored: StoredMessage[] = [
      {
        id: "msg-1",
        role: "assistant",
        parts: [
          {
            type: "tool-invocation",
            toolCallId: "call-1",
            state: "done",
            input: {},
            output: {},
          },
        ],
        createdAt: "2026-01-05T10:00:00.000Z",
      },
    ];

    const result = toUIMessages(stored);

    expect(result[0].parts[0]).toEqual({
      type: "tool-invocation",
      toolCallId: "call-1",
      state: "done",
      input: {},
      output: {},
    });
  });
});

describe("roundtrip serialization", () => {
  it("preserves message data through serialize -> deserialize", () => {
    const original: UIMessage[] = [
      {
        id: "msg-user",
        role: "user",
        parts: [{ type: "text", text: "Tell me a joke" }],
      },
      {
        id: "msg-assistant",
        role: "assistant",
        parts: [
          { type: "text", text: "Why did the chicken cross the road?" },
          { type: "text", text: "To get to the other side!" },
        ],
      },
    ];

    const timestamps = new Map([
      ["msg-user", "2026-01-05T10:00:00.000Z"],
      ["msg-assistant", "2026-01-05T10:00:05.000Z"],
    ]);

    const stored = toStoredMessages(original, timestamps);
    const restored = toUIMessages(stored);

    expect(restored).toHaveLength(2);
    expect(restored[0].id).toBe("msg-user");
    expect(restored[0].role).toBe("user");
    expect(restored[0].parts).toEqual([
      { type: "text", text: "Tell me a joke" },
    ]);

    expect(restored[1].id).toBe("msg-assistant");
    expect(restored[1].role).toBe("assistant");
    expect(restored[1].parts).toHaveLength(2);
  });
});
