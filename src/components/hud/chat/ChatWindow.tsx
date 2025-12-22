"use client";

import { MessageSquare, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { ChatInput } from "@/components/hud/chat/ChatInput";
import { ChatLog } from "@/components/hud/chat/ChatLog";
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
  const t = useTranslations("chat");
  const { messages, canSend, sendMessage, setOpen } = useTextChat();
  const sessionId = useLocalPlayerStore((state) => state.sessionId);

  return (
    <Card className="w-80">
      <CardHeader className="space-y-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="size-4" />
              {t("title")}
            </CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-1 text-[11px]">
              {t.rich("pressEnterToSend", {
                key: (chunks) => <Kbd>{chunks}</Kbd>,
              })}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            onClick={() => setOpen(false)}
            aria-label={t("title")}
          >
            <X />
          </Button>
        </div>
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
  );
};
