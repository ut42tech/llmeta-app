"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  BotMessageSquare,
  HistoryIcon,
  ImageIcon,
  MessageSquareText,
  Minimize2,
  Send,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
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
import { useTextChat } from "@/hooks/useTextChat";
import { useAIChatStore } from "@/stores/aiChatStore";
import { useChatStore } from "@/stores/chatStore";

const SUGGESTIONS = [
  "Summarize this chat",
  "Explain the conversation flow",
  "Are there any misunderstandings?",
  "Generate an image based on the chat",
];

export const AIChatWindow = () => {
  const { close, includeChatHistory, toggleChatHistory } = useAIChatStore();
  const chatMessages = useChatStore((state) => state.messages);
  const [isMinimized, setIsMinimized] = useState(false);
  const { sendMessage: sendToChat, canSend: canSendToChat } = useTextChat();

  const chatMessagesRef = useRef(chatMessages);
  chatMessagesRef.current = chatMessages;
  const includeChatHistoryRef = useRef(includeChatHistory);
  includeChatHistoryRef.current = includeChatHistory;

  const getChatHistoryForContext = () => {
    if (!includeChatHistoryRef.current) return undefined;
    return chatMessagesRef.current.map((msg) => ({
      id: msg.id,
      sessionId: msg.sessionId,
      username: msg.username,
      content: msg.content,
      direction: msg.direction,
      sentAt: msg.sentAt,
    }));
  };

  const { messages, status, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai/chat",
      body: () => ({
        chatHistory: getChatHistoryForContext(),
      }),
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
          <span className="font-medium text-sm">AI Agent</span>
        </div>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={includeChatHistory ? "default" : "ghost"}
                size="icon-sm"
                onClick={toggleChatHistory}
              >
                <MessageSquareText className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>
                {includeChatHistory
                  ? "Include chat history in context (ON)"
                  : "Include chat history in context (OFF)"}
              </p>
            </TooltipContent>
          </Tooltip>
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
                    switch (part.type) {
                      case "text":
                        return (
                          <MessageResponse key={`${message.id}-${index}`}>
                            {part.text}
                          </MessageResponse>
                        );
                      case "tool-generateImage": {
                        const toolPart = part as {
                          type: string;
                          toolCallId: string;
                          state: string;
                          input?: { prompt?: string };
                          output?: {
                            image?: string;
                            mediaType?: string;
                            prompt?: string;
                          };
                          errorText?: string;
                        };

                        const handleSendToChat = async () => {
                          if (!toolPart.output?.image || !canSendToChat) return;

                          try {
                            const response = await fetch(
                              "/api/blob/images/upload",
                              {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  base64: toolPart.output.image,
                                  mediaType:
                                    toolPart.output.mediaType || "image/webp",
                                  prompt: toolPart.output.prompt,
                                }),
                              },
                            );

                            if (!response.ok) {
                              throw new Error("Failed to upload image");
                            }

                            const { url, prompt } = (await response.json()) as {
                              url: string;
                              prompt?: string;
                            };

                            await sendToChat("", {
                              url,
                              prompt,
                            });
                          } catch (error) {
                            console.error(
                              "[AIChatWindow] Failed to send image:",
                              error,
                            );
                          }
                        };

                        switch (toolPart.state) {
                          case "input-streaming":
                          case "input-available":
                            return (
                              <div
                                key={`${message.id}-${index}`}
                                className="flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-muted-foreground text-sm"
                              >
                                <ImageIcon className="size-4 animate-pulse" />
                                <span>
                                  Generating image: {toolPart.input?.prompt}
                                </span>
                              </div>
                            );
                          case "output-available":
                            if (toolPart.output?.image) {
                              return (
                                <div
                                  key={`${message.id}-${index}`}
                                  className="space-y-2"
                                >
                                  <Image
                                    src={`data:${toolPart.output.mediaType || "image/webp"};base64,${toolPart.output.image}`}
                                    alt={
                                      toolPart.output.prompt ||
                                      "Generated image"
                                    }
                                    width={512}
                                    height={512}
                                    className="h-auto max-w-full overflow-hidden rounded-lg"
                                    unoptimized
                                  />
                                  {toolPart.output.prompt && (
                                    <p className="text-muted-foreground text-xs">
                                      {toolPart.output.prompt}
                                    </p>
                                  )}
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full gap-2"
                                        onClick={handleSendToChat}
                                        disabled={!canSendToChat}
                                      >
                                        <Send className="size-3" />
                                        Send to Chat
                                      </Button>
                                    </TooltipTrigger>
                                    {!canSendToChat && (
                                      <TooltipContent>
                                        <p>Connect to a room to send images</p>
                                      </TooltipContent>
                                    )}
                                  </Tooltip>
                                </div>
                              );
                            }
                            return null;
                          case "output-error":
                            return (
                              <div
                                key={`${message.id}-${index}`}
                                className="rounded-lg bg-red-50 p-3 text-red-600 text-sm"
                              >
                                Error generating image: {toolPart.errorText}
                              </div>
                            );
                          default:
                            console.log(
                              "Unhandled tool state:",
                              toolPart.state,
                              toolPart,
                            );
                            return null;
                        }
                      }
                      default:
                        // Debug: Log unhandled part types
                        if (part.type !== "step-start") {
                          console.log("Unhandled part type:", part.type, part);
                        }
                        return null;
                    }
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
