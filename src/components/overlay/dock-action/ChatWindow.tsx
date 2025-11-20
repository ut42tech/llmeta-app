"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTextChat } from "@/hooks/useTextChat";
import { cn } from "@/lib/utils";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";
import type { ChatMessage } from "@/types/chat";

interface ChatInputProps {
  canSend: boolean;
  onSend: (message: string) => Promise<void>;
}

function ChatInput({ canSend, onSend }: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  const handleSend = async () => {
    if (!inputValue.trim() || !canSend) {
      return;
    }

    await onSend(inputValue.trim());
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="backdrop-blur-md bg-background/80 border border-border/50 rounded-lg shadow-lg p-3">
      <div className="flex gap-2 items-center">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder="Type a message..."
          disabled={!canSend}
          className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
          maxLength={500}
        />
        <Button
          onClick={handleSend}
          disabled={!canSend || !inputValue.trim()}
          size="icon"
          className="shrink-0"
          aria-label="Send"
        >
          <ArrowUp />
        </Button>
      </div>
    </div>
  );
}

interface ChatLogProps {
  messages: ChatMessage[];
  sessionId: string | null;
}

function ChatLog({ messages, sessionId }: ChatLogProps) {
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
            .map((message) => {
              const isOwnMessage = message.sessionId === sessionId;

              return (
                <div
                  key={message.id}
                  className="flex flex-col gap-0.5 animate-in fade-in slide-in-from-bottom-2 duration-150"
                >
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
                      <span className="text-destructive text-[10px]">
                        Failed
                      </span>
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
            })}
        </div>
      </ScrollArea>
    </div>
  );
}

export function ChatWindow() {
  const { messages, canSend, sendMessage } = useTextChat();
  const sessionId = useLocalPlayerStore((state) => state.sessionId);

  return (
    <div className="fixed bottom-4 left-4 z-50 pointer-events-auto">
      <div className="w-80 flex flex-col-reverse gap-2">
        <ChatInput canSend={canSend} onSend={sendMessage} />
        <ChatLog messages={messages} sessionId={sessionId} />
      </div>
    </div>
  );
}
