import { MessageSquare } from "lucide-react";
import { useEffect, useRef } from "react";
import { ChatMessageItem } from "@/components/overlay/dock-action/chat/ChatMessageItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatMessage } from "@/types/chat";

interface ChatLogProps {
  messages: ChatMessage[];
  sessionId: string | null;
}

export function ChatLog({ messages, sessionId }: ChatLogProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(messages.length);

  useEffect(() => {
    if (messages.length !== prevMessagesLengthRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      prevMessagesLengthRef.current = messages.length;
    }
  }, [messages.length]);

  return (
    <div className="h-64">
      {messages.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <MessageSquare className="size-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">No messages yet</p>
            <p className="text-xs text-muted-foreground">
              Start the conversation to see replies here
            </p>
          </div>
        </div>
      ) : (
        <ScrollArea className="h-full pr-4">
          <div className="flex flex-col-reverse gap-3 pb-4">
            <div ref={messagesEndRef} />
            {messages
              .slice()
              .reverse()
              .map((message) => (
                <ChatMessageItem
                  key={message.id}
                  message={message}
                  isOwnMessage={message.sessionId === sessionId}
                />
              ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
