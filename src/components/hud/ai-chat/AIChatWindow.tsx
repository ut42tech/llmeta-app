"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { BotMessageSquare, Info, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Loader } from "@/components/ai-elements/loader";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { AIChatSidebar } from "@/components/hud/ai-chat/AIChatSidebar";
import { AIChatWelcome } from "@/components/hud/ai-chat/AIChatWelcome";
import { MessagePartRenderer } from "@/components/hud/ai-chat/MessagePartRenderer";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Kbd } from "@/components/ui/kbd";
import { useAIChatHistory } from "@/hooks/ai-chat";
import { useTextChat } from "@/hooks/chat";
import { useAuthStore } from "@/stores/authStore";
import { useChatStore } from "@/stores/chatStore";
import { useWorldStore } from "@/stores/worldStore";
import type { AIContext } from "@/types/ai";

const AI_CHAT_KEYBOARD_SHORTCUT = "/";
const MAX_TITLE_LENGTH = 50;

export const AIChatWindow = () => {
  const t = useTranslations("aiChat");
  const tChat = useTranslations("chat");

  const isOpen = useChatStore((s) => s.aiChat.isOpen);
  const close = useChatStore((s) => s.closeAIChat);
  const toggleAIChat = useChatStore((s) => s.toggleAIChat);
  const chatMessages = useChatStore((s) => s.messages);
  const profile = useAuthStore((s) => s.profile);
  const contentItems = useWorldStore((s) => s.contentItems);
  const { sendMessage: sendToChat, canSend: canSendToChat } = useTextChat();

  // Ref for textarea focus
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Track previous isOpen state to detect open event
  const prevIsOpenRef = useRef(false);

  // Keyboard shortcut to toggle AI chat
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger when typing in input fields
      const target = event.target as HTMLElement;
      const isInputField =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (event.key === AI_CHAT_KEYBOARD_SHORTCUT && !isInputField) {
        event.preventDefault();
        toggleAIChat();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleAIChat]);

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

  const contentItemsRef = useRef(contentItems);
  contentItemsRef.current = contentItems;

  const getContext = useCallback((): AIContext => {
    const images = contentItemsRef.current;
    return {
      currentDateTime: new Date().toISOString(),
      images:
        images.length > 0
          ? {
              recentImages: images.slice(-10).map((item) => ({
                prompt: item.image.prompt || "No prompt available",
                username: item.username,
                createdAt: new Date(item.createdAt).toISOString(),
              })),
            }
          : undefined,
    };
  }, []);

  const { messages, status, sendMessage, setMessages } = useChat({
    id: "ai-chat-window",
    transport: new DefaultChatTransport({
      api: "/api/ai/chat",
      prepareSendMessagesRequest: ({ messages }) => ({
        body: {
          message: messages.at(-1),
          conversationId: conversationIdRef.current,
          chatHistory: getChatHistory(),
          context: getContext(),
        },
      }),
    }),
  });

  // Sync messages when loading from history
  useEffect(() => setMessages(initialMessages), [initialMessages, setMessages]);

  // Reset to welcome screen and focus textarea when dialog opens
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      startNew();
      setMessages([]);
      // Focus textarea after dialog animation
      const timer = setTimeout(() => textareaRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, startNew, setMessages]);

  const handleOpenChange = (open: boolean) => {
    if (!open) close();
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
    if (await ensureConversation(text)) {
      sendMessage({ text });
    }
  };

  const handleSendImage = async (url: string, prompt?: string) => {
    if (canSendToChat)
      await sendToChat("", { url, prompt }).catch(console.error);
  };

  const handleRefine = (msg: string) => sendMessage({ text: msg });

  const isStreaming = status === "streaming";
  const showLoader = isStreaming && messages.at(-1)?.role !== "assistant";
  const isWelcomeScreen = messages.length === 0 && !conversationId;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="flex h-[80vh] max-h-175 w-[90vw] max-w-5xl! flex-row gap-0 overflow-hidden p-0 sm:max-w-5xl"
        showCloseButton={false}
      >
        {/* Sidebar */}
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
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2.5 font-semibold text-base">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                  <BotMessageSquare className="size-4 text-primary" />
                </div>
                {t("title")}
              </DialogTitle>
              <DialogClose className="flex items-center gap-2 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
                <Kbd>ESC</Kbd>
                <XIcon className="size-4" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </div>
          </DialogHeader>

          {/* Main Content Area */}
          {isLoadingMessages ? (
            <div className="flex flex-1 items-center justify-center">
              <Loader className="text-muted-foreground" />
            </div>
          ) : isWelcomeScreen ? (
            /* Welcome Screen */
            <AIChatWelcome
              username={profile?.display_name ?? undefined}
              onSuggestion={handleSuggestion}
              className="flex-1"
            />
          ) : (
            <Conversation className="flex-1 overflow-y-auto">
              <ConversationContent className="mx-auto max-w-3xl px-6 py-6">
                {messages.map((msg) => (
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
                ))}
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

          {/* Input Area */}
          <div className="shrink-0 border-t bg-background/95 px-6 py-4 backdrop-blur-sm">
            <div className="mx-auto max-w-3xl">
              <PromptInput onSubmit={handleSubmit}>
                <PromptInputTextarea
                  ref={textareaRef}
                  placeholder={
                    isWelcomeScreen
                      ? t("welcome.placeholder")
                      : tChat("typePlaceholder")
                  }
                  className="max-h-32 min-h-11"
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
                <p className="text-[11px] text-muted-foreground/60 leading-tight">
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
