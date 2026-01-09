import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  useNotifyingAction,
  useNotifyingOperation,
} from "@/hooks/common/useNotifyingAction";
import { notificationBus } from "@/lib/notification-bus";

// Mock the notification bus
vi.mock("@/lib/notification-bus", () => ({
  notificationBus: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

describe("useNotifyingAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("loading state", () => {
    it("starts with isLoading as false", () => {
      const action = vi.fn().mockResolvedValue({ success: true, data: "test" });
      const { result } = renderHook(() => useNotifyingAction(action));

      expect(result.current.isLoading).toBe(false);
    });

    it("sets isLoading to true during execution", async () => {
      let resolvePromise: (value: { success: true; data: string }) => void;
      const promise = new Promise<{ success: true; data: string }>(
        (resolve) => {
          resolvePromise = resolve;
        },
      );
      const action = vi.fn().mockReturnValue(promise);

      const { result } = renderHook(() => useNotifyingAction(action));

      // Start execution but don't await
      let executePromise: Promise<unknown>;
      act(() => {
        executePromise = result.current.execute();
      });

      expect(result.current.isLoading).toBe(true);

      // Resolve and wait
      await act(async () => {
        resolvePromise?.({ success: true, data: "test" });
        await executePromise;
      });

      expect(result.current.isLoading).toBe(false);
    });

    it("sets isLoading to false after successful execution", async () => {
      const action = vi.fn().mockResolvedValue({ success: true, data: "test" });
      const { result } = renderHook(() => useNotifyingAction(action));

      await act(async () => {
        await result.current.execute();
      });

      expect(result.current.isLoading).toBe(false);
    });

    it("sets isLoading to false after failed execution", async () => {
      const action = vi
        .fn()
        .mockResolvedValue({ success: false, error: "Failed" });
      const { result } = renderHook(() => useNotifyingAction(action));

      await act(async () => {
        await result.current.execute();
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("success notification", () => {
    it("emits success notification when action succeeds with message", async () => {
      const action = vi.fn().mockResolvedValue({ success: true, data: "test" });
      const { result } = renderHook(() =>
        useNotifyingAction(action, { successMessage: "Operation successful!" }),
      );

      await act(async () => {
        await result.current.execute();
      });

      expect(notificationBus.success).toHaveBeenCalledWith(
        "Operation successful!",
        { source: undefined },
      );
    });

    it("does not emit success notification when no successMessage provided", async () => {
      const action = vi.fn().mockResolvedValue({ success: true, data: "test" });
      const { result } = renderHook(() => useNotifyingAction(action));

      await act(async () => {
        await result.current.execute();
      });

      expect(notificationBus.success).not.toHaveBeenCalled();
    });

    it("includes source in success notification", async () => {
      const action = vi.fn().mockResolvedValue({ success: true, data: "test" });
      const { result } = renderHook(() =>
        useNotifyingAction(action, {
          successMessage: "Done!",
          source: "test-source",
        }),
      );

      await act(async () => {
        await result.current.execute();
      });

      expect(notificationBus.success).toHaveBeenCalledWith("Done!", {
        source: "test-source",
      });
    });
  });

  describe("error notification", () => {
    it("emits error notification when action fails", async () => {
      const action = vi
        .fn()
        .mockResolvedValue({ success: false, error: "Something went wrong" });
      const { result } = renderHook(() => useNotifyingAction(action));

      await act(async () => {
        await result.current.execute();
      });

      expect(notificationBus.error).toHaveBeenCalledWith(
        "Something went wrong",
        { source: undefined },
      );
    });

    it("uses custom errorMessage when provided", async () => {
      const action = vi
        .fn()
        .mockResolvedValue({ success: false, error: "Original error" });
      const { result } = renderHook(() =>
        useNotifyingAction(action, { errorMessage: "Custom error message" }),
      );

      await act(async () => {
        await result.current.execute();
      });

      expect(notificationBus.error).toHaveBeenCalledWith(
        "Custom error message",
        { source: undefined },
      );
    });

    it("emits error notification when action throws", async () => {
      const action = vi.fn().mockRejectedValue(new Error("Exception occurred"));
      const { result } = renderHook(() => useNotifyingAction(action));

      await act(async () => {
        await result.current.execute();
      });

      expect(notificationBus.error).toHaveBeenCalledWith("Exception occurred", {
        source: undefined,
      });
    });

    it("uses custom errorMessage when action throws", async () => {
      const action = vi.fn().mockRejectedValue(new Error("Exception occurred"));
      const { result } = renderHook(() =>
        useNotifyingAction(action, {
          errorMessage: "Custom exception message",
        }),
      );

      await act(async () => {
        await result.current.execute();
      });

      expect(notificationBus.error).toHaveBeenCalledWith(
        "Custom exception message",
        { source: undefined },
      );
    });

    it("handles non-Error exceptions", async () => {
      const action = vi.fn().mockRejectedValue("string error");
      const { result } = renderHook(() => useNotifyingAction(action));

      await act(async () => {
        await result.current.execute();
      });

      expect(notificationBus.error).toHaveBeenCalledWith("An error occurred", {
        source: undefined,
      });
    });
  });

  describe("return value", () => {
    it("returns success result from action", async () => {
      const action = vi
        .fn()
        .mockResolvedValue({ success: true, data: { id: 123 } });
      const { result } = renderHook(() => useNotifyingAction(action));

      let actionResult: unknown;
      await act(async () => {
        actionResult = await result.current.execute();
      });

      expect(actionResult).toEqual({ success: true, data: { id: 123 } });
    });

    it("returns failure result from action", async () => {
      const action = vi
        .fn()
        .mockResolvedValue({ success: false, error: "Failed" });
      const { result } = renderHook(() => useNotifyingAction(action));

      let actionResult: unknown;
      await act(async () => {
        actionResult = await result.current.execute();
      });

      expect(actionResult).toEqual({ success: false, error: "Failed" });
    });

    it("returns failure result when action throws", async () => {
      const action = vi.fn().mockRejectedValue(new Error("Exception"));
      const { result } = renderHook(() => useNotifyingAction(action));

      let actionResult: unknown;
      await act(async () => {
        actionResult = await result.current.execute();
      });

      expect(actionResult).toEqual({ success: false, error: "Exception" });
    });
  });
});

describe("useNotifyingOperation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("loading state", () => {
    it("starts with isLoading as false", () => {
      const operation = vi.fn().mockResolvedValue("data");
      const { result } = renderHook(() => useNotifyingOperation(operation));

      expect(result.current.isLoading).toBe(false);
    });

    it("sets isLoading to false after completion", async () => {
      const operation = vi.fn().mockResolvedValue("data");
      const { result } = renderHook(() => useNotifyingOperation(operation));

      await act(async () => {
        await result.current.execute();
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("success notification", () => {
    it("emits success notification when operation succeeds with message", async () => {
      const operation = vi.fn().mockResolvedValue("result");
      const { result } = renderHook(() =>
        useNotifyingOperation(operation, { successMessage: "Success!" }),
      );

      await act(async () => {
        await result.current.execute();
      });

      expect(notificationBus.success).toHaveBeenCalledWith("Success!", {
        source: undefined,
      });
    });

    it("does not emit success notification when no message provided", async () => {
      const operation = vi.fn().mockResolvedValue("result");
      const { result } = renderHook(() => useNotifyingOperation(operation));

      await act(async () => {
        await result.current.execute();
      });

      expect(notificationBus.success).not.toHaveBeenCalled();
    });
  });

  describe("error notification", () => {
    it("emits error notification when operation throws", async () => {
      const operation = vi.fn().mockRejectedValue(new Error("Op failed"));
      const { result } = renderHook(() => useNotifyingOperation(operation));

      await act(async () => {
        await result.current.execute();
      });

      expect(notificationBus.error).toHaveBeenCalledWith("Op failed", {
        source: undefined,
      });
    });

    it("uses custom errorMessage when provided", async () => {
      const operation = vi.fn().mockRejectedValue(new Error("Original"));
      const { result } = renderHook(() =>
        useNotifyingOperation(operation, { errorMessage: "Custom error" }),
      );

      await act(async () => {
        await result.current.execute();
      });

      expect(notificationBus.error).toHaveBeenCalledWith("Custom error", {
        source: undefined,
      });
    });
  });

  describe("return value", () => {
    it("returns success result with data", async () => {
      const operation = vi.fn().mockResolvedValue({ id: 1, name: "test" });
      const { result } = renderHook(() => useNotifyingOperation(operation));

      let opResult: unknown;
      await act(async () => {
        opResult = await result.current.execute();
      });

      expect(opResult).toEqual({
        success: true,
        data: { id: 1, name: "test" },
      });
    });

    it("returns failure result when operation throws", async () => {
      const operation = vi.fn().mockRejectedValue(new Error("Failed"));
      const { result } = renderHook(() => useNotifyingOperation(operation));

      let opResult: unknown;
      await act(async () => {
        opResult = await result.current.execute();
      });

      expect(opResult).toEqual({ success: false, error: "Failed" });
    });
  });
});
