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
        <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            No messages yet
          </p>
          <p className="text-xs text-muted-foreground/80">
            Start the conversation to see replies here.
          </p>
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
