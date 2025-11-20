"use client";

import { MessageSquare, X } from "lucide-react";
import { ChatInput } from "@/components/overlay/dock-action/chat/ChatInput";
import { ChatLog } from "@/components/overlay/dock-action/chat/ChatLog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Kbd } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTextChat } from "@/hooks/useTextChat";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";

export function ChatWindow() {
  const {
    messages,
    canSend,
    sendMessage,
    isOpen,
    setOpen,
    unreadCount,
    sendTyping,
    typingUsers,
  } = useTextChat();
  const sessionId = useLocalPlayerStore((state) => state.sessionId);

  return (
    <div className="pointer-events-auto fixed bottom-6 left-6 z-50">
      {isOpen ? (
        <Card className="w-80">
          <CardHeader className="space-y-1">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 space-y-1">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="size-4" />
                  Chat
                </CardTitle>
                <CardDescription className="flex flex-wrap items-center gap-1 text-[11px]">
                  <span>Press</span>
                  <Kbd>Enter</Kbd>
                  <span>to send</span>
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0"
                onClick={() => setOpen(false)}
              >
                <X />
                <span className="sr-only">Minimize chat</span>
              </Button>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="p-4">
            <ChatLog
              messages={messages}
              sessionId={sessionId}
              typingUsers={typingUsers}
            />
          </CardContent>
          <Separator />
          <CardFooter className="p-4">
            <ChatInput
              canSend={canSend}
              onSend={sendMessage}
              onTypingChange={sendTyping}
            />
          </CardFooter>
        </Card>
      ) : (
        <div className="relative">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon-lg"
                variant="secondary"
                aria-label="Chat"
                onClick={() => setOpen(true)}
              >
                <MessageSquare />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>Chat</TooltipContent>
          </Tooltip>
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-2 -top-2 size-6 p-0"
            >
              {unreadCount}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
