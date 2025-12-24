import { beforeEach, describe, expect, it } from "vitest";
import { useChatStore } from "@/stores/chatStore";

describe("useChatStore", () => {
  beforeEach(() => {
    useChatStore.getState().reset();
  });

  describe("initial state", () => {
    it("has correct initial state", () => {
      const state = useChatStore.getState();
      expect(state.messages).toEqual([]);
      expect(state.isOpen).toBe(false);
      expect(state.aiChat.isOpen).toBe(false);
    });
  });

  describe("message management", () => {
    it("adds incoming message", () => {
      const { addIncomingMessage } = useChatStore.getState();

      addIncomingMessage({
        id: "msg-1",
        sessionId: "session-1",
        content: "Hello!",
        sentAt: Date.now(),
      });

      const { messages } = useChatStore.getState();
      expect(messages).toHaveLength(1);
      expect(messages[0]).toMatchObject({
        id: "msg-1",
        content: "Hello!",
        direction: "incoming",
        status: "sent",
      });
    });

    it("adds outgoing message", () => {
      const { addOutgoingMessage } = useChatStore.getState();

      addOutgoingMessage({
        id: "msg-1",
        sessionId: "session-1",
        content: "Hi there!",
        sentAt: Date.now(),
      });

      const { messages } = useChatStore.getState();
      expect(messages).toHaveLength(1);
      expect(messages[0]).toMatchObject({
        id: "msg-1",
        content: "Hi there!",
        direction: "outgoing",
        status: "pending",
      });
    });

    it("updates message with same ID", () => {
      const { addIncomingMessage } = useChatStore.getState();

      addIncomingMessage({
        id: "msg-1",
        sessionId: "session-1",
        content: "Original",
        sentAt: Date.now(),
      });

      addIncomingMessage({
        id: "msg-1",
        sessionId: "session-1",
        content: "Updated",
        sentAt: Date.now(),
      });

      const { messages } = useChatStore.getState();
      expect(messages).toHaveLength(1);
      expect(messages[0].content).toBe("Updated");
    });

    it("updates message status", () => {
      const { addOutgoingMessage, updateMessageStatus } =
        useChatStore.getState();

      addOutgoingMessage({
        id: "msg-1",
        sessionId: "session-1",
        content: "Sending...",
        sentAt: Date.now(),
      });

      updateMessageStatus("msg-1", "sent");

      const { messages } = useChatStore.getState();
      expect(messages[0].status).toBe("sent");
    });

    it("does nothing when updating non-existent message ID", () => {
      const { addOutgoingMessage, updateMessageStatus } =
        useChatStore.getState();

      addOutgoingMessage({
        id: "msg-1",
        sessionId: "session-1",
        content: "Hello",
        sentAt: Date.now(),
      });

      updateMessageStatus("non-existent", "sent");

      const { messages } = useChatStore.getState();
      expect(messages).toHaveLength(1);
      expect(messages[0].status).toBe("pending");
    });
  });

  describe("UI state", () => {
    it("opens and closes chat panel", () => {
      const { setOpen } = useChatStore.getState();

      expect(useChatStore.getState().isOpen).toBe(false);

      setOpen(true);
      expect(useChatStore.getState().isOpen).toBe(true);

      setOpen(false);
      expect(useChatStore.getState().isOpen).toBe(false);
    });

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
  });

  describe("reset", () => {
    it("resets store to initial state", () => {
      const { addIncomingMessage, setOpen, openAIChat, reset } =
        useChatStore.getState();

      addIncomingMessage({
        id: "msg-1",
        sessionId: "session-1",
        content: "Hello",
        sentAt: Date.now(),
      });
      setOpen(true);
      openAIChat();

      reset();

      const state = useChatStore.getState();
      expect(state.messages).toEqual([]);
      expect(state.isOpen).toBe(false);
      expect(state.aiChat.isOpen).toBe(false);
    });
  });
});
