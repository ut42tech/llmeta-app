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
import { useTextChat } from "@/hooks";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

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
        "fade-in slide-in-from-bottom-1 animate-in duration-300",
        "flex items-start gap-2 text-xs",
      )}
      style={{ maxWidth: "100%" }}
    >
      <Badge
        variant={message.isOwn ? "default" : "secondary"}
        className="h-5 shrink-0 px-1.5 text-[10px]"
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
            className="max-h-24 max-w-32 rounded object-cover"
            unoptimized
          />
        )}
        {hasText && (
          <span
            className={cn(
              "text-white/70 leading-5 drop-shadow-sm",
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
    <Empty className="h-full gap-2 border-0 p-0">
      <EmptyMedia variant="icon" className="size-8 bg-white/10">
        <MessageSquare className="size-4 text-white/60" />
      </EmptyMedia>
      <EmptyTitle className="text-white/70 text-xs">
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
    <div className="pointer-events-auto fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3">
      {/* Message Stream */}
      <div className="h-40 w-64 overflow-hidden rounded-xl bg-black/20 p-3 backdrop-blur-sm">
        {isEmpty ? (
          <ChatEmptyState />
        ) : (
          <ScrollArea className="h-full w-full">
            <div className="flex w-full flex-col gap-2 pr-3">
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
