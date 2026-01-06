"use client";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { DefaultChatTransport } from "ai";
import { BotMessageSquare, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef } from "react";
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
import { AIChatSidebar } from "@/components/hud/ai-chat/AIChatSidebar";
import { ImageToolResult } from "@/components/hud/ai-chat/ImageToolResult";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAIChatHistory } from "@/hooks/useAIChatHistory";
import { useTextChat } from "@/hooks/useTextChat";
import { useChatStore } from "@/stores/chatStore";

const MAX_TITLE_LENGTH = 50;

// Message part renderer
const MessagePartRenderer = ({
  message,
  part,
  index,
  isStreaming,
  canSendToChat,
  onSendToChat,
  onRefine,
}: {
  message: UIMessage;
  part: UIMessage["parts"][number];
  index: number;
  isStreaming: boolean;
  canSendToChat: boolean;
  onSendToChat: (url: string, prompt?: string) => void;
  onRefine: (msg: string) => void;
}) => {
  const key = `${message.id}-${index}`;

  if (part.type === "text") {
    return <MessageResponse key={key}>{part.text}</MessageResponse>;
  }

  if (part.type === "tool-generateImage") {
    return (
      <ImageToolResult
        key={key}
        toolPart={part as Parameters<typeof ImageToolResult>[0]["toolPart"]}
        isStreaming={isStreaming}
        canSendToChat={canSendToChat}
        onSendToChat={onSendToChat}
        onRefine={onRefine}
      />
    );
  }

  return null;
};

export const AIChatWindow = () => {
  const t = useTranslations("aiChat");
  const tChat = useTranslations("chat");

  const isOpen = useChatStore((s) => s.aiChat.isOpen);
  const close = useChatStore((s) => s.closeAIChat);
  const chatMessages = useChatStore((s) => s.messages);
  const { sendMessage: sendToChat, canSend: canSendToChat } = useTextChat();

  const {
    conversationId,
    conversations,
    initialMessages,
    isLoadingConversations,
    isLoadingMessages,
    create,
    remove,
    rename,
    select,
    startNew,
  } = useAIChatHistory();

  // Refs for stable callback values
  const chatMessagesRef = useRef(chatMessages);
  chatMessagesRef.current = chatMessages;
  const conversationIdRef = useRef(conversationId);
  conversationIdRef.current = conversationId;

  const getChatHistory = useCallback(
    () =>
      chatMessagesRef.current.map(
        ({ id, senderId, username, content, isOwn, sentAt }) => ({
          id,
          senderId,
          username,
          content,
          isOwn,
          sentAt,
        }),
      ),
    [],
  );

  const { messages, status, sendMessage, setMessages } = useChat({
    id: "ai-chat-window",
    transport: new DefaultChatTransport({
      api: "/api/ai/chat",
      prepareSendMessagesRequest: ({ messages }) => ({
        body: {
          message: messages.at(-1),
          conversationId: conversationIdRef.current,
          chatHistory: getChatHistory(),
        },
      }),
    }),
  });

  // Sync messages & start new on open
  useEffect(() => setMessages(initialMessages), [initialMessages, setMessages]);

  const handleOpenChange = (open: boolean) => {
    if (open) startNew();
    else close();
  };

  const ensureConversation = async (text: string) => {
    if (conversationId) return true;
    const conv = await create(text.slice(0, MAX_TITLE_LENGTH));
    if (!conv) return false;
    conversationIdRef.current = conv.id;
    return true;
  };

  const handleSubmit = async ({ text }: { text: string }) => {
    const trimmed = text.trim();
    if (trimmed && (await ensureConversation(trimmed)))
      sendMessage({ text: trimmed });
  };

  const handleSuggestion = async (text: string) => {
    if (await ensureConversation(text)) sendMessage({ text });
  };

  const handleSendImage = async (url: string, prompt?: string) => {
    if (canSendToChat)
      await sendToChat("", { url, prompt }).catch(console.error);
  };

  const handleRefine = (msg: string) => sendMessage({ text: msg });

  const suggestions = [
    t("suggestions.summarize"),
    t("suggestions.explainFlow"),
    t("suggestions.misunderstandings"),
    t("suggestions.generateImage"),
  ];

  const isStreaming = status === "streaming";
  const showLoader = isStreaming && messages.at(-1)?.role !== "assistant";

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="flex h-[80vh] max-h-175 w-[90vw] max-w-5xl! flex-row gap-0 overflow-hidden p-0 sm:max-w-5xl"
        showCloseButton
      >
        <AIChatSidebar
          conversations={conversations}
          currentConversationId={conversationId}
          isLoading={isLoadingConversations}
          onSelect={select}
          onCreate={startNew}
          onDelete={remove}
          onRename={rename}
        />

        <div className="flex min-w-0 flex-1 flex-col bg-background">
          {/* Header */}
          <DialogHeader className="shrink-0 border-b bg-background/95 px-6 py-4 backdrop-blur-sm">
            <DialogTitle className="flex items-center gap-2.5 font-semibold text-base">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                <BotMessageSquare className="size-4 text-primary" />
              </div>
              {t("title")}
            </DialogTitle>
          </DialogHeader>

          {/* Main Content Area */}
          {isLoadingMessages ? (
            <div className="flex flex-1 items-center justify-center">
              <Loader className="text-muted-foreground" />
            </div>
          ) : (
            <Conversation className="flex-1 overflow-y-auto">
              <ConversationContent className="mx-auto max-w-3xl px-6 py-6">
                {messages.length === 0 ? (
                  <ConversationEmptyState
                    title={t("emptyStateTitle")}
                    description={t("emptyStateDescription")}
                    icon={
                      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                        <BotMessageSquare className="size-7 text-primary" />
                      </div>
                    }
                  />
                ) : (
                  messages.map((msg) => (
                    <Message key={msg.id} from={msg.role}>
                      <MessageContent>
                        {msg.parts.map((part, i) => (
                          <MessagePartRenderer
                            key={`${msg.id}-${i}`}
                            message={msg}
                            part={part}
                            index={i}
                            isStreaming={isStreaming}
                            canSendToChat={canSendToChat}
                            onSendToChat={handleSendImage}
                            onRefine={handleRefine}
                          />
                        ))}
                      </MessageContent>
                    </Message>
                  ))
                )}
                {showLoader && (
                  <Message from="assistant">
                    <MessageContent>
                      <Loader className="text-muted-foreground" />
                    </MessageContent>
                  </Message>
                )}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>
          )}

          {/* Suggestions */}
          {messages.length === 0 && !isLoadingMessages && (
            <div className="shrink-0 border-t bg-muted/20 px-6 py-4">
              <div className="mx-auto max-w-3xl">
                <Suggestions className="justify-center">
                  {suggestions.map((s) => (
                    <Suggestion
                      key={s}
                      suggestion={s}
                      onClick={handleSuggestion}
                      variant="secondary"
                      size="sm"
                    />
                  ))}
                </Suggestions>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="shrink-0 border-t bg-background px-6 py-4">
            <div className="mx-auto max-w-3xl">
              <PromptInput
                onSubmit={handleSubmit}
                className="rounded-xl border border-border/50 bg-muted/30 shadow-sm transition-colors focus-within:border-primary/30 focus-within:bg-background"
              >
                <PromptInputTextarea
                  placeholder={tChat("typePlaceholder")}
                  className="min-h-11 max-h-32 border-0 bg-transparent shadow-none focus-visible:ring-0"
                />
                <PromptInputFooter>
                  <PromptInputTools />
                  <PromptInputSubmit
                    status={status}
                    disabled={isStreaming || status === "submitted"}
                  />
                </PromptInputFooter>
              </PromptInput>

              {/* Disclaimer */}
              <div className="mt-3 flex items-center justify-center gap-1.5 text-center">
                <Info className="size-3 shrink-0 text-muted-foreground/60" />
                <p className="text-[11px] leading-tight text-muted-foreground/60">
                  {t("disclaimer")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
