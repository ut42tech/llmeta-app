import { beforeEach, describe, expect, it } from "vitest";
import { useChatStore } from "@/stores/chatStore";
import type { ChatMessage } from "@/types/chat";

const createMessage = (overrides: Partial<ChatMessage> = {}): ChatMessage => ({
  id: "msg-1",
  senderId: "user-1",
  sessionId: "session-1",
  username: "Test User",
  content: "Hello!",
  sentAt: new Date().toISOString(),
  isOwn: false,
  ...overrides,
});

describe("useChatStore", () => {
  beforeEach(() => {
    useChatStore.getState().reset();
  });

  describe("initial state", () => {
    it("has correct initial state", () => {
      const state = useChatStore.getState();
      expect(state.messages).toEqual([]);
      expect(state.aiChat.isOpen).toBe(false);
      expect(state.aiChat.conversationId).toBe(null);
    });
  });

  describe("message management", () => {
    it("adds a message", () => {
      const { addMessage } = useChatStore.getState();
      const message = createMessage();

      addMessage(message);

      const { messages } = useChatStore.getState();
      expect(messages).toHaveLength(1);
      expect(messages[0]).toMatchObject({
        id: "msg-1",
        content: "Hello!",
        senderId: "user-1",
      });
    });

    it("skips duplicate message with same ID", () => {
      const { addMessage } = useChatStore.getState();

      addMessage(createMessage({ id: "msg-1", content: "First" }));
      addMessage(createMessage({ id: "msg-1", content: "Duplicate" }));

      const { messages } = useChatStore.getState();
      expect(messages).toHaveLength(1);
      expect(messages[0].content).toBe("First");
    });

    it("sets messages array", () => {
      const { setMessages } = useChatStore.getState();
      const messages = [
        createMessage({ id: "msg-1" }),
        createMessage({ id: "msg-2" }),
      ];

      setMessages(messages);

      expect(useChatStore.getState().messages).toHaveLength(2);
    });

    it("limits messages to MAX_CHAT_MESSAGES", () => {
      const { setMessages, addMessage } = useChatStore.getState();

      // Set 200 messages (max)
      const initialMessages = Array.from({ length: 200 }, (_, i) =>
        createMessage({ id: `msg-${i}` }),
      );
      setMessages(initialMessages);

      // Add one more
      addMessage(createMessage({ id: "msg-new" }));

      const { messages } = useChatStore.getState();
      expect(messages).toHaveLength(200);
      expect(messages[199].id).toBe("msg-new");
    });
  });

  describe("AI chat state", () => {
    it("toggles AI chat", () => {
      const { toggleAIChat } = useChatStore.getState();

      expect(useChatStore.getState().aiChat.isOpen).toBe(false);

      toggleAIChat();
      expect(useChatStore.getState().aiChat.isOpen).toBe(true);

      toggleAIChat();
      expect(useChatStore.getState().aiChat.isOpen).toBe(false);
    });

    it("opens and closes AI chat", () => {
      const { openAIChat, closeAIChat } = useChatStore.getState();

      openAIChat();
      expect(useChatStore.getState().aiChat.isOpen).toBe(true);

      closeAIChat();
      expect(useChatStore.getState().aiChat.isOpen).toBe(false);
    });

    it("sets AI conversation ID", () => {
      const { setAIConversationId } = useChatStore.getState();

      setAIConversationId("conv-123");
      expect(useChatStore.getState().aiChat.conversationId).toBe("conv-123");

      setAIConversationId(null);
      expect(useChatStore.getState().aiChat.conversationId).toBe(null);
    });
  });

  describe("reset", () => {
    it("resets store to initial state", () => {
      const { addMessage, openAIChat, setAIConversationId, reset } =
        useChatStore.getState();

      addMessage(createMessage());
      openAIChat();
      setAIConversationId("conv-123");

      reset();

      const state = useChatStore.getState();
      expect(state.messages).toEqual([]);
      expect(state.aiChat.isOpen).toBe(false);
      expect(state.aiChat.conversationId).toBe(null);
    });
  });
});
