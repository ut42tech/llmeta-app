"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { BotMessageSquare, HistoryIcon, Minimize2, X } from "lucide-react";
import { useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Loader } from "@/components/ai-elements/loader";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAIChatStore } from "@/stores/aiChatStore";

const SUGGESTIONS = [
  "How do I use this app?",
  "What's the weather today?",
  "Recommend me a book",
];

export const AIChatWindow = () => {
  const { close } = useAIChatStore();
  const [isMinimized, setIsMinimized] = useState(false);

  const { messages, status, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai/chat",
    }),
  });

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage({ text: suggestion });
  };

  const handleSubmit = (message: { text: string }) => {
    if (message.text.trim()) {
      sendMessage({ text: message.text });
    }
  };

  if (isMinimized) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon-lg"
              onClick={() => setIsMinimized(false)}
            >
              <HistoryIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Back to Agent Chat</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="flex h-[500px] w-[400px] flex-col overflow-hidden rounded-xl border bg-background/95 shadow-2xl backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <BotMessageSquare className="size-4" />
          <span className="font-medium text-sm">AI Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setIsMinimized(true)}
          >
            <Minimize2 className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={close}>
            <X className="size-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <Conversation className="flex-1 overflow-y-auto">
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              title="AI Agent"
              description="Ask me anything!"
              icon={<BotMessageSquare className="size-8" />}
            />
          ) : (
            messages.map((message) => (
              <Message key={message.id} from={message.role}>
                <MessageContent>
                  {message.parts.map((part, index) => {
                    if (part.type === "text") {
                      return (
                        <MessageResponse key={`${message.id}-${index}`}>
                          {part.text}
                        </MessageResponse>
                      );
                    }
                    return null;
                  })}
                </MessageContent>
              </Message>
            ))
          )}
          {status === "streaming" && messages.at(-1)?.role !== "assistant" && (
            <Message from="assistant">
              <MessageContent>
                <Loader className="text-muted-foreground" />
              </MessageContent>
            </Message>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* Suggestions */}
      {messages.length === 0 && (
        <div className="border-t px-4 py-3">
          <Suggestions>
            {SUGGESTIONS.map((suggestion) => (
              <Suggestion
                key={suggestion}
                suggestion={suggestion}
                onClick={handleSuggestionClick}
                variant="secondary"
                size="sm"
              />
            ))}
          </Suggestions>
        </div>
      )}

      {/* Input */}
      <div className="border-t">
        <PromptInput
          onSubmit={(message) => handleSubmit(message)}
          className="border-0 shadow-none"
        >
          <PromptInputTextarea
            placeholder="Type a message..."
            className="min-h-10 max-h-24"
          />
          <PromptInputFooter>
            <PromptInputTools />
            <PromptInputSubmit
              status={status}
              disabled={status === "streaming" || status === "submitted"}
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
};
