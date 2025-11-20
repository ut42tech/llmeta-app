import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/chat";

interface ChatMessageItemProps {
  message: ChatMessage;
  isOwnMessage: boolean;
}

export function ChatMessageItem({
  message,
  isOwnMessage,
}: ChatMessageItemProps) {
  const formattedTime = new Date(message.sentAt).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  const statusLabel =
    message.status && message.status !== "sent"
      ? message.status === "pending"
        ? "Sending"
        : "Failed"
      : null;

  return (
    <div
      className={cn(
        "animate-in fade-in slide-in-from-bottom-2 duration-150 flex flex-col gap-1",
        isOwnMessage ? "items-end" : "items-start",
      )}
    >
      <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-[11px]">
        {message.username && (
          <Badge
            variant={isOwnMessage ? "default" : "secondary"}
            className="px-2 py-0"
          >
            {message.username}
          </Badge>
        )}
        <span>{formattedTime}</span>
        {isOwnMessage && statusLabel && (
          <Badge
            variant={message.status === "failed" ? "destructive" : "outline"}
            className="uppercase tracking-wide"
          >
            {statusLabel}
          </Badge>
        )}
      </div>

      <div
        className={cn(
          "max-w-[85%] rounded-lg border px-3 py-2 text-sm shadow-sm",
          isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted",
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      </div>
    </div>
  );
}
