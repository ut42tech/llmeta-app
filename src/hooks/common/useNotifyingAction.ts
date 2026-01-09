"use client";

import { useCallback, useState } from "react";
import { notificationBus } from "@/lib/notification-bus";

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

type NotifyingOptions = {
  successMessage?: string;
  errorMessage?: string;
  source?: string;
};

/**
 * Wraps Server Actions (returning ActionResult<T>) with automatic notifications
 */
export function useNotifyingAction<T>(
  action: () => Promise<ActionResult<T>>,
  options: NotifyingOptions = {},
) {
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(async (): Promise<ActionResult<T>> => {
    setIsLoading(true);
    try {
      const result = await action();

      if (result.success) {
        if (options.successMessage) {
          notificationBus.success(options.successMessage, {
            source: options.source,
          });
        }
      } else {
        notificationBus.error(options.errorMessage ?? result.error, {
          source: options.source,
        });
      }

      return result;
    } catch (error) {
      const msg =
        options.errorMessage ??
        (error instanceof Error ? error.message : "An error occurred");
      notificationBus.error(msg, { source: options.source });
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  }, [action, options.successMessage, options.errorMessage, options.source]);

  return { execute, isLoading };
}

/**
 * Wraps simple async operations with automatic notifications
 */
export function useNotifyingOperation<T>(
  operation: () => Promise<T>,
  options: NotifyingOptions = {},
) {
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(async (): Promise<{
    success: boolean;
    data?: T;
    error?: string;
  }> => {
    setIsLoading(true);
    try {
      const data = await operation();
      if (options.successMessage) {
        notificationBus.success(options.successMessage, {
          source: options.source,
        });
      }
      return { success: true, data };
    } catch (error) {
      const msg =
        options.errorMessage ??
        (error instanceof Error ? error.message : "An error occurred");
      notificationBus.error(msg, { source: options.source });
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  }, [operation, options.successMessage, options.errorMessage, options.source]);

  return { execute, isLoading };
}
