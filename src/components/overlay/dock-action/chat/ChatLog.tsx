import { useEffect, useRef } from "react";
import { ChatMessageItem } from "@/components/overlay/dock-action/chat/ChatMessageItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatMessage } from "@/types/chat";

interface ChatLogProps {
  messages: ChatMessage[];
  sessionId: string | null;
}

export function ChatLog({ messages, sessionId }: ChatLogProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(messages.length);

  useEffect(() => {
    if (messages.length !== prevMessagesLengthRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      prevMessagesLengthRef.current = messages.length;
    }
  }, [messages.length]);

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="h-[400px] backdrop-blur-md bg-background/70 border border-border/50 rounded-lg shadow-lg">
      <ScrollArea ref={scrollAreaRef} className="h-full">
        <div className="space-y-2 flex flex-col-reverse p-3">
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
    </div>
  );
}
