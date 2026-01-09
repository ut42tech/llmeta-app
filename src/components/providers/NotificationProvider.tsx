"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import {
  type NotificationEvent,
  notificationBus,
} from "@/lib/notification-bus";

const DURATIONS = {
  success: 3000,
  error: 5000,
  info: 3000,
  warning: 4000,
} as const;

/**
 * Subscribes to NotificationBus and displays toasts automatically
 */
export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    return notificationBus.subscribe((event: NotificationEvent) => {
      const options = event.description
        ? { description: event.description }
        : undefined;
      toast[event.type](event.message, {
        duration: DURATIONS[event.type],
        ...options,
      });
    });
  }, []);

  return <>{children}</>;
}
