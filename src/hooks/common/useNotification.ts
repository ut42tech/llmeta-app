"use client";

import { useCallback } from "react";
import { type ExternalToast, toast } from "sonner";

type NotificationOptions = ExternalToast;

type PromiseMessages<T> = {
  loading: string;
  success: string | ((data: T) => string);
  error: string | ((error: Error) => string);
};

export function useNotification() {
  const showSuccess = useCallback(
    (message: string, options?: NotificationOptions) =>
      toast.success(message, { duration: 3000, ...options }),
    [],
  );

  const showError = useCallback(
    (message: string, options?: NotificationOptions) =>
      toast.error(message, { duration: 5000, ...options }),
    [],
  );

  const showPromise = useCallback(
    <T>(
      promise: Promise<T>,
      messages: PromiseMessages<T>,
      options?: NotificationOptions,
    ) =>
      toast.promise(promise, {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
        ...options,
      }),
    [],
  );

  const dismiss = useCallback((toastId?: string | number) => {
    toast.dismiss(toastId);
  }, []);

  return {
    showSuccess,
    showError,
    showPromise,
    dismiss,
    toast,
  };
}
