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
  WandSparkles,
  X,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
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
import { useChatStore } from "@/stores/chatStore";

export const AIChatWindow = () => {
  const t = useTranslations("aiChat");
  const tChat = useTranslations("chat");
  const tCommon = useTranslations("common");
  const close = useChatStore((state) => state.closeAIChat);
  const includeChatHistory = useChatStore(
    (state) => state.aiChat.includeChatHistory,
  );
  const toggleChatHistory = useChatStore((state) => state.toggleAIChatHistory);
  const chatMessages = useChatStore((state) => state.messages);
  const [isMinimized, setIsMinimized] = useState(false);
  const { sendMessage: sendToChat, canSend: canSendToChat } = useTextChat();
  const [refineImageId, setRefineImageId] = useState<string | null>(null);
  const [refineInput, setRefineInput] = useState("");

  const SUGGESTIONS = [
    t("suggestions.summarize"),
    t("suggestions.explainFlow"),
    t("suggestions.misunderstandings"),
    t("suggestions.generateImage"),
  ];

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
            <p>{t("backToChat")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="flex h-[500px] w-[400px] flex-col overflow-hidden rounded-xl border bg-background/95 shadow-2xl backdrop-blur-sm">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <BotMessageSquare className="size-4" />
          <span className="font-medium text-sm">{t("title")}</span>
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
                  ? t("includeChatHistoryOn")
                  : t("includeChatHistoryOff")}
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

      <Conversation className="flex-1 overflow-y-auto">
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              title={t("emptyStateTitle")}
              description={t("emptyStateDescription")}
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
                            imageUrl?: string;
                            prompt?: string;
                          };
                          errorText?: string;
                        };

                        const handleSendToChat = async () => {
                          if (!toolPart.output?.imageUrl || !canSendToChat)
                            return;

                          try {
                            await sendToChat("", {
                              url: toolPart.output.imageUrl,
                              prompt: toolPart.output.prompt,
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
                                  {t("generatingImage", {
                                    prompt: toolPart.input?.prompt || "",
                                  })}
                                </span>
                              </div>
                            );
                          case "output-available":
                            if (toolPart.output?.imageUrl) {
                              const imageId = `${message.id}-${index}`;
                              const isRefining = refineImageId === imageId;

                              const handleRefine = () => {
                                if (!refineInput.trim()) return;
                                const originalPrompt =
                                  toolPart.output?.prompt ||
                                  "the previous image";
                                const refineMessage = `Please regenerate the image with these modifications: "${refineInput}". Original prompt was: "${originalPrompt}"`;
                                sendMessage({ text: refineMessage });
                                setRefineImageId(null);
                                setRefineInput("");
                              };

                              return (
                                <div key={imageId} className="space-y-2">
                                  <Image
                                    src={toolPart.output.imageUrl}
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

                                  {isRefining ? (
                                    <div className="space-y-2">
                                      <div className="flex gap-2">
                                        <input
                                          type="text"
                                          value={refineInput}
                                          onChange={(e) =>
                                            setRefineInput(e.target.value)
                                          }
                                          placeholder={t("refinePlaceholder")}
                                          className="flex-1 rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                          onKeyDown={(e) => {
                                            if (
                                              e.key === "Enter" &&
                                              !e.shiftKey
                                            ) {
                                              e.preventDefault();
                                              handleRefine();
                                            }
                                            if (e.key === "Escape") {
                                              setRefineImageId(null);
                                              setRefineInput("");
                                            }
                                          }}
                                          ref={(input) => input?.focus()}
                                        />
                                      </div>
                                      <div className="flex gap-2">
                                        <Button
                                          variant="default"
                                          size="sm"
                                          className="flex-1 gap-2"
                                          onClick={handleRefine}
                                          disabled={
                                            !refineInput.trim() ||
                                            status === "streaming"
                                          }
                                        >
                                          <WandSparkles className="size-3" />
                                          {t("regenerate")}
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => {
                                            setRefineImageId(null);
                                            setRefineInput("");
                                          }}
                                        >
                                          {tCommon("cancel")}
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex gap-2">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 gap-2"
                                            onClick={() =>
                                              setRefineImageId(imageId)
                                            }
                                            disabled={status === "streaming"}
                                          >
                                            <WandSparkles className="size-3" />
                                            {t("refine")}
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>{t("refineTooltip")}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 gap-2"
                                            onClick={handleSendToChat}
                                            disabled={!canSendToChat}
                                          >
                                            <Send className="size-3" />
                                            {t("sendToChat")}
                                          </Button>
                                        </TooltipTrigger>
                                        {!canSendToChat && (
                                          <TooltipContent>
                                            <p>{t("connectToSend")}</p>
                                          </TooltipContent>
                                        )}
                                      </Tooltip>
                                    </div>
                                  )}
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
                                {t("errorGeneratingImage", {
                                  error: toolPart.errorText || "Unknown error",
                                })}
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

      <div className="border-t">
        <PromptInput
          onSubmit={(message) => handleSubmit(message)}
          className="border-0 shadow-none"
        >
          <PromptInputTextarea
            placeholder={tChat("typePlaceholder")}
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
