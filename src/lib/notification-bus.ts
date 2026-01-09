"use client";

import { toast } from "sonner";

// =============================================================================
// Types
// =============================================================================

export type NotificationType = "success" | "error" | "info" | "warning";

export type NotificationEvent = {
  type: NotificationType;
  message: string;
  source?: string;
  description?: string;
};

type NotificationHandler = (event: NotificationEvent) => void;

// =============================================================================
// NotificationBus - Event Bus for centralized notifications
// =============================================================================

class NotificationBus {
  private handlers = new Set<NotificationHandler>();

  subscribe(handler: NotificationHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  emit(event: NotificationEvent): void {
    this.handlers.forEach((handler) => {
      try {
        handler(event);
      } catch (error) {
        console.error("[NotificationBus] Handler error:", error);
      }
    });
  }

  success(
    message: string,
    options?: Omit<NotificationEvent, "type" | "message">,
  ): void {
    this.emit({ type: "success", message, ...options });
  }

  error(
    message: string,
    options?: Omit<NotificationEvent, "type" | "message">,
  ): void {
    this.emit({ type: "error", message, ...options });
  }

  info(
    message: string,
    options?: Omit<NotificationEvent, "type" | "message">,
  ): void {
    this.emit({ type: "info", message, ...options });
  }

  warning(
    message: string,
    options?: Omit<NotificationEvent, "type" | "message">,
  ): void {
    this.emit({ type: "warning", message, ...options });
  }
}

export const notificationBus = new NotificationBus();

// =============================================================================
// Promise-based notification helper
// =============================================================================

export function promiseNotification<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: Error) => string);
  },
): Promise<T> {
  toast.promise(promise, messages);
  return promise;
}
