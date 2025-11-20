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
  return (
    <div className="flex flex-col gap-0.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
      <div className="flex items-center gap-2 text-xs px-1">
        {message.username && (
          <span
            className={cn(
              "font-medium",
              isOwnMessage ? "text-primary" : "text-foreground",
            )}
          >
            {message.username}
          </span>
        )}
        <span className="text-muted-foreground/60 text-[10px]">
          {new Date(message.sentAt).toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        {isOwnMessage && message.status === "pending" && (
          <span className="text-muted-foreground/60 text-[10px]">
            Sending...
          </span>
        )}
        {isOwnMessage && message.status === "failed" && (
          <span className="text-destructive text-[10px]">Failed</span>
        )}
      </div>

      <div
        className={cn(
          "inline-block rounded-lg px-3 py-1.5 max-w-[85%] wrap-break-word",
          isOwnMessage
            ? "bg-primary/70 text-primary-foreground"
            : "bg-muted/70",
        )}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
      </div>
    </div>
  );
}
