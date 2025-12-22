import { beforeEach, describe, expect, it } from "vitest";
import { useTranscriptionStore } from "@/stores/transcriptionStore";

describe("useTranscriptionStore", () => {
  beforeEach(() => {
    useTranscriptionStore.getState().reset();
  });

  describe("initial state", () => {
    it("has correct initial values", () => {
      const state = useTranscriptionStore.getState();
      expect(state.entries).toEqual([]);
      expect(state.partial).toBeUndefined();
      expect(state.isStreaming).toBe(false);
      expect(state.error).toBeUndefined();
      expect(state.pendingAutoSend).toEqual([]);
    });
  });

  describe("addEntry", () => {
    it("adds entry with id, text, and timestamp", () => {
      useTranscriptionStore.getState().addEntry("Hello world");

      const { entries } = useTranscriptionStore.getState();
      expect(entries).toHaveLength(1);
      expect(entries[0].text).toBe("Hello world");
      expect(entries[0].id).toBeDefined();
      expect(entries[0].timestamp).toBeDefined();
    });

    it("trims whitespace from text", () => {
      useTranscriptionStore.getState().addEntry("  spaced text  ");

      const { entries } = useTranscriptionStore.getState();
      expect(entries[0].text).toBe("spaced text");
    });

    it("ignores empty string", () => {
      useTranscriptionStore.getState().addEntry("");

      const { entries } = useTranscriptionStore.getState();
      expect(entries).toHaveLength(0);
    });

    it("ignores whitespace-only string", () => {
      useTranscriptionStore.getState().addEntry("   ");

      const { entries } = useTranscriptionStore.getState();
      expect(entries).toHaveLength(0);
    });

    it("adds text to pendingAutoSend", () => {
      useTranscriptionStore.getState().addEntry("Message 1");
      useTranscriptionStore.getState().addEntry("Message 2");

      const { pendingAutoSend } = useTranscriptionStore.getState();
      expect(pendingAutoSend).toEqual(["Message 1", "Message 2"]);
    });

    it("respects MAX_HISTORY limit of 50", () => {
      for (let i = 0; i < 55; i++) {
        useTranscriptionStore.getState().addEntry(`Entry ${i}`);
      }

      const { entries } = useTranscriptionStore.getState();
      expect(entries).toHaveLength(50);
      expect(entries[0].text).toBe("Entry 5");
      expect(entries[49].text).toBe("Entry 54");
    });
  });

  describe("setPartial", () => {
    it("sets partial text", () => {
      useTranscriptionStore.getState().setPartial("partial...");

      expect(useTranscriptionStore.getState().partial).toBe("partial...");
    });

    it("trims partial text", () => {
      useTranscriptionStore.getState().setPartial("  partial  ");

      expect(useTranscriptionStore.getState().partial).toBe("partial");
    });

    it("clears partial when undefined", () => {
      useTranscriptionStore.getState().setPartial("some text");
      useTranscriptionStore.getState().setPartial(undefined);

      expect(useTranscriptionStore.getState().partial).toBeUndefined();
    });

    it("clears partial when empty string", () => {
      useTranscriptionStore.getState().setPartial("some text");
      useTranscriptionStore.getState().setPartial("");

      expect(useTranscriptionStore.getState().partial).toBeUndefined();
    });
  });

  describe("setStreaming", () => {
    it("sets isStreaming to true", () => {
      useTranscriptionStore.getState().setStreaming(true);

      expect(useTranscriptionStore.getState().isStreaming).toBe(true);
    });

    it("preserves partial when streaming starts", () => {
      useTranscriptionStore.getState().setPartial("ongoing");
      useTranscriptionStore.getState().setStreaming(true);

      expect(useTranscriptionStore.getState().partial).toBe("ongoing");
    });

    it("clears partial when streaming stops", () => {
      useTranscriptionStore.getState().setPartial("partial");
      useTranscriptionStore.getState().setStreaming(true);
      useTranscriptionStore.getState().setStreaming(false);

      expect(useTranscriptionStore.getState().partial).toBeUndefined();
    });
  });

  describe("setError", () => {
    it("sets error message", () => {
      useTranscriptionStore.getState().setError("Something went wrong");

      expect(useTranscriptionStore.getState().error).toBe(
        "Something went wrong",
      );
    });

    it("clears error with undefined", () => {
      useTranscriptionStore.getState().setError("Error");
      useTranscriptionStore.getState().setError(undefined);

      expect(useTranscriptionStore.getState().error).toBeUndefined();
    });
  });

  describe("consumePendingAutoSend", () => {
    it("returns all pending messages", () => {
      useTranscriptionStore.getState().addEntry("Msg 1");
      useTranscriptionStore.getState().addEntry("Msg 2");

      const pending = useTranscriptionStore.getState().consumePendingAutoSend();

      expect(pending).toEqual(["Msg 1", "Msg 2"]);
    });

    it("clears pending after consumption", () => {
      useTranscriptionStore.getState().addEntry("Msg 1");
      useTranscriptionStore.getState().consumePendingAutoSend();

      expect(useTranscriptionStore.getState().pendingAutoSend).toEqual([]);
    });

    it("returns empty array when nothing pending", () => {
      const pending = useTranscriptionStore.getState().consumePendingAutoSend();

      expect(pending).toEqual([]);
    });
  });

  describe("reset", () => {
    it("resets to initial state", () => {
      useTranscriptionStore.getState().addEntry("Entry");
      useTranscriptionStore.getState().setPartial("partial");
      useTranscriptionStore.getState().setStreaming(true);
      useTranscriptionStore.getState().setError("Error");

      useTranscriptionStore.getState().reset();

      const state = useTranscriptionStore.getState();
      expect(state.entries).toEqual([]);
      expect(state.partial).toBeUndefined();
      expect(state.isStreaming).toBe(false);
      expect(state.error).toBeUndefined();
      expect(state.pendingAutoSend).toEqual([]);
    });
  });
});
