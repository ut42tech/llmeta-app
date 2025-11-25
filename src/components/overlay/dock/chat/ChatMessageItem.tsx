"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/chat";

type ChatMessageItemProps = {
  message: ChatMessage;
  isOwnMessage: boolean;
};

type StatusBadgeInfo = {
  label: string;
  variant: "destructive" | "outline";
};

const getStatusBadge = (
  status: ChatMessage["status"],
): StatusBadgeInfo | null => {
  if (!status || status === "sent") return null;

  return {
    label: status === "pending" ? "Sending" : "Failed",
    variant: status === "failed" ? "destructive" : "outline",
  };
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const ChatMessageItem = ({
  message,
  isOwnMessage,
}: ChatMessageItemProps) => {
  const formattedTime = formatTime(new Date(message.sentAt));
  const statusBadge = isOwnMessage ? getStatusBadge(message.status) : null;

  return (
    <div
      className={cn(
        "animate-in fade-in slide-in-from-bottom-2 flex flex-col gap-1.5",
        isOwnMessage ? "items-end" : "items-start",
      )}
    >
      {/* Message metadata */}
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
        {message.username && (
          <Badge
            variant={isOwnMessage ? "default" : "secondary"}
            className="h-4 px-1.5 text-[10px]"
          >
            {message.username}
          </Badge>
        )}
        <span>{formattedTime}</span>
        {statusBadge && (
          <Badge
            variant={statusBadge.variant}
            className="h-4 px-1.5 text-[10px] uppercase tracking-wide"
          >
            {statusBadge.label}
          </Badge>
        )}
      </div>

      {/* Message content */}
      <div
        className={cn(
          "max-w-[85%] rounded-lg px-3 py-2 text-sm",
          isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted",
        )}
      >
        <p className="whitespace-pre-wrap wrap-break-word leading-relaxed">
          {message.content}
        </p>
      </div>
    </div>
  );
};
