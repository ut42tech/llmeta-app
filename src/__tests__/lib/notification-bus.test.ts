import { beforeEach, describe, expect, it, vi } from "vitest";

// We need to test the NotificationBus class directly
// Import the module to test
import {
  type NotificationEvent,
  notificationBus,
} from "@/lib/notification-bus";

describe("NotificationBus", () => {
  beforeEach(() => {
    // Clear all existing handlers before each test
    // Since notificationBus is a singleton, we need to ensure clean state
    // We'll do this by subscribing and immediately unsubscribing in tests
  });

  describe("subscribe", () => {
    it("should add a handler and return unsubscribe function", () => {
      const handler = vi.fn();
      const unsubscribe = notificationBus.subscribe(handler);

      expect(typeof unsubscribe).toBe("function");

      // Clean up
      unsubscribe();
    });

    it("should call handler when event is emitted", () => {
      const handler = vi.fn();
      const unsubscribe = notificationBus.subscribe(handler);

      const event: NotificationEvent = {
        type: "success",
        message: "Test message",
      };
      notificationBus.emit(event);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(event);

      unsubscribe();
    });

    it("should support multiple subscribers", () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      const unsubscribe1 = notificationBus.subscribe(handler1);
      const unsubscribe2 = notificationBus.subscribe(handler2);

      const event: NotificationEvent = {
        type: "info",
        message: "Test for multiple",
      };
      notificationBus.emit(event);

      expect(handler1).toHaveBeenCalledWith(event);
      expect(handler2).toHaveBeenCalledWith(event);

      unsubscribe1();
      unsubscribe2();
    });
  });

  describe("unsubscribe", () => {
    it("should stop receiving events after unsubscribe", () => {
      const handler = vi.fn();
      const unsubscribe = notificationBus.subscribe(handler);

      // Emit once - should receive
      notificationBus.emit({ type: "success", message: "First" });
      expect(handler).toHaveBeenCalledTimes(1);

      // Unsubscribe
      unsubscribe();

      // Emit again - should NOT receive
      notificationBus.emit({ type: "success", message: "Second" });
      expect(handler).toHaveBeenCalledTimes(1); // Still 1
    });
  });

  describe("emit", () => {
    it("should handle all notification types", () => {
      const handler = vi.fn();
      const unsubscribe = notificationBus.subscribe(handler);

      const types: NotificationEvent["type"][] = [
        "success",
        "error",
        "info",
        "warning",
      ];

      types.forEach((type) => {
        notificationBus.emit({ type, message: `Test ${type}` });
      });

      expect(handler).toHaveBeenCalledTimes(4);

      unsubscribe();
    });

    it("should handle optional properties", () => {
      const handler = vi.fn();
      const unsubscribe = notificationBus.subscribe(handler);

      const event: NotificationEvent = {
        type: "success",
        message: "Test",
        source: "test-source",
        description: "Test description",
      };
      notificationBus.emit(event);

      expect(handler).toHaveBeenCalledWith(event);

      unsubscribe();
    });

    it("should continue emitting to other handlers if one throws", () => {
      const errorHandler = vi.fn(() => {
        throw new Error("Handler error");
      });
      const successHandler = vi.fn();

      const unsubscribe1 = notificationBus.subscribe(errorHandler);
      const unsubscribe2 = notificationBus.subscribe(successHandler);

      // Should not throw, and should still call successHandler
      expect(() => {
        notificationBus.emit({ type: "success", message: "Test" });
      }).not.toThrow();

      expect(errorHandler).toHaveBeenCalled();
      expect(successHandler).toHaveBeenCalled();

      unsubscribe1();
      unsubscribe2();
    });
  });

  describe("convenience methods", () => {
    it("success() should emit success type", () => {
      const handler = vi.fn();
      const unsubscribe = notificationBus.subscribe(handler);

      notificationBus.success("Success message");

      expect(handler).toHaveBeenCalledWith({
        type: "success",
        message: "Success message",
      });

      unsubscribe();
    });

    it("error() should emit error type", () => {
      const handler = vi.fn();
      const unsubscribe = notificationBus.subscribe(handler);

      notificationBus.error("Error message");

      expect(handler).toHaveBeenCalledWith({
        type: "error",
        message: "Error message",
      });

      unsubscribe();
    });

    it("info() should emit info type", () => {
      const handler = vi.fn();
      const unsubscribe = notificationBus.subscribe(handler);

      notificationBus.info("Info message");

      expect(handler).toHaveBeenCalledWith({
        type: "info",
        message: "Info message",
      });

      unsubscribe();
    });

    it("warning() should emit warning type", () => {
      const handler = vi.fn();
      const unsubscribe = notificationBus.subscribe(handler);

      notificationBus.warning("Warning message");

      expect(handler).toHaveBeenCalledWith({
        type: "warning",
        message: "Warning message",
      });

      unsubscribe();
    });

    it("convenience methods should accept optional options", () => {
      const handler = vi.fn();
      const unsubscribe = notificationBus.subscribe(handler);

      notificationBus.success("With options", {
        source: "test",
        description: "desc",
      });

      expect(handler).toHaveBeenCalledWith({
        type: "success",
        message: "With options",
        source: "test",
        description: "desc",
      });

      unsubscribe();
    });
  });
});
