"use client";

import { MessageSquare } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { ChatInput } from "@/components/hud/chat/ChatInput";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTextChat } from "@/hooks/useTextChat";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/chat";

type MessageLineProps = {
  message: ChatMessage;
};

const MessageLine = ({ message }: MessageLineProps) => {
  const displayName = message.username || "???";
  const hasImage = Boolean(message.image?.url);
  const hasText = Boolean(message.content);

  return (
    <div
      className={cn(
        "animate-in fade-in slide-in-from-bottom-1 duration-300",
        "flex items-start gap-2 text-xs",
      )}
      style={{ maxWidth: "100%" }}
    >
      <Badge
        variant={message.isOwn ? "default" : "secondary"}
        className="shrink-0 h-5 px-1.5 text-[10px]"
      >
        {displayName}
      </Badge>
      <div className="flex flex-col gap-1">
        {hasImage && message.image && (
          <Image
            src={message.image.url}
            alt={message.image.prompt || "Shared image"}
            width={128}
            height={96}
            className="max-w-32 max-h-24 rounded object-cover"
            unoptimized
          />
        )}
        {hasText && (
          <span
            className={cn(
              "text-white/70 drop-shadow-sm leading-5",
              message.isOwn && "text-white/90",
            )}
            style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
          >
            {message.content}
          </span>
        )}
      </div>
    </div>
  );
};

const ChatEmptyState = () => {
  const t = useTranslations("chat");

  return (
    <Empty className="h-full border-0 p-0 gap-2">
      <EmptyMedia variant="icon" className="size-8 bg-white/10">
        <MessageSquare className="size-4 text-white/60" />
      </EmptyMedia>
      <EmptyTitle className="text-xs text-white/70">
        {t("noMessagesYet")}
      </EmptyTitle>
      <EmptyDescription className="text-[10px] text-white/50">
        {t("startConversation")}
      </EmptyDescription>
    </Empty>
  );
};

export const ChatStream = () => {
  const { messages } = useTextChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(messages.length);

  useEffect(() => {
    if (messages.length !== prevMessagesLengthRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      prevMessagesLengthRef.current = messages.length;
    }
  }, [messages.length]);

  const isEmpty = messages.length === 0;

  return (
    <div className="fixed left-6 bottom-6 z-50 pointer-events-auto flex flex-col items-start gap-3">
      {/* Message Stream */}
      <div className="w-64 h-40 rounded-xl bg-black/20 backdrop-blur-sm p-3 overflow-hidden">
        {isEmpty ? (
          <ChatEmptyState />
        ) : (
          <ScrollArea className="h-full w-full">
            <div className="flex flex-col gap-2 pr-3 w-full">
              {messages.map((message) => (
                <MessageLine key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Input */}
      <ChatInput />
    </div>
  );
};
