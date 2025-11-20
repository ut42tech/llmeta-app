import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/chat";

interface ChatMessageItemProps {
  message: ChatMessage;
  isOwnMessage: boolean;
}

function getStatusBadge(status: ChatMessage["status"]) {
  if (!status || status === "sent") return null;

  return {
    label: status === "pending" ? "Sending" : "Failed",
    variant: status === "failed" ? "destructive" : "outline",
  } as const;
}

export function ChatMessageItem({
  message,
  isOwnMessage,
}: ChatMessageItemProps) {
  const formattedTime = new Date(message.sentAt).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  const statusBadge = isOwnMessage ? getStatusBadge(message.status) : null;

  return (
    <div
      className={cn(
        "animate-in fade-in slide-in-from-bottom-2 flex flex-col gap-1.5",
        isOwnMessage ? "items-end" : "items-start",
      )}
    >
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

      <div
        className={cn(
          "max-w-[85%] rounded-lg border px-3 py-2 text-sm shadow-sm",
          isOwnMessage && "bg-primary text-primary-foreground border-primary",
          !isOwnMessage && "bg-muted",
        )}
      >
        <p className="whitespace-pre-wrap wrap-break-word leading-relaxed">
          {message.content}
        </p>
      </div>
    </div>
  );
}
