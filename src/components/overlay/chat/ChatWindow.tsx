"use client";

import { MessageSquare, X } from "lucide-react";
import { ChatInput } from "@/components/overlay/chat/ChatInput";
import { ChatLog } from "@/components/overlay/chat/ChatLog";
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
import { useTextChat } from "@/hooks/useTextChat";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";

export const ChatWindow = () => {
  const { messages, canSend, sendMessage, setOpen, sendTyping, typingUsers } =
    useTextChat();
  const sessionId = useLocalPlayerStore((state) => state.sessionId);

  return (
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
            aria-label="Minimize chat"
          >
            <X />
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
  );
};
