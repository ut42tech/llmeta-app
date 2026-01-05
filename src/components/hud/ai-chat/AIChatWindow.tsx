"use client";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { DefaultChatTransport } from "ai";
import { BotMessageSquare } from "lucide-react";
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

        <div className="flex min-w-0 flex-1 flex-col">
          <DialogHeader className="shrink-0 border-b px-4 py-3">
            <DialogTitle className="flex items-center gap-2 font-medium text-sm">
              <BotMessageSquare className="size-4" />
              {t("title")}
            </DialogTitle>
          </DialogHeader>

          {isLoadingMessages ? (
            <div className="flex flex-1 items-center justify-center">
              <Loader className="text-muted-foreground" />
            </div>
          ) : (
            <Conversation className="flex-1 overflow-y-auto">
              <ConversationContent>
                {messages.length === 0 ? (
                  <ConversationEmptyState
                    title={t("emptyStateTitle")}
                    description={t("emptyStateDescription")}
                    icon={<BotMessageSquare className="size-8" />}
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

          {messages.length === 0 && !isLoadingMessages && (
            <div className="flex-none border-t px-4 py-3">
              <Suggestions>
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
          )}

          <div className="flex-none border-t">
            <PromptInput
              onSubmit={handleSubmit}
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
                  disabled={isStreaming || status === "submitted"}
                />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
