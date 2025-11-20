"use client";

import { ChatInput } from "@/components/overlay/dock-action/chat/ChatInput";
import { ChatLog } from "@/components/overlay/dock-action/chat/ChatLog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Kbd } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";
import { useTextChat } from "@/hooks/useTextChat";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";

export function ChatWindow() {
  const { messages, canSend, sendMessage } = useTextChat();
  const sessionId = useLocalPlayerStore((state) => state.sessionId);

  return (
    <div className="pointer-events-auto fixed bottom-6 left-6 z-50">
      <Card className="w-80 shadow-lg backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-base">Text chat</CardTitle>
          <CardDescription className="flex flex-wrap items-center gap-1 text-[11px]">
            <span>Press</span>
            <Kbd>Enter</Kbd>
            <span>to send</span>
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="p-4">
          <ChatLog messages={messages} sessionId={sessionId} />
        </CardContent>
        <Separator />
        <CardFooter className="p-4">
          <ChatInput canSend={canSend} onSend={sendMessage} />
        </CardFooter>
      </Card>
    </div>
  );
}
