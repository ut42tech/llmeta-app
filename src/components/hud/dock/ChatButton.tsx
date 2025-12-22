"use client";

import { MessageSquare, MessageSquareShare } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTextChat } from "@/hooks/chat/useTextChat";
import { useTranscriptionStore } from "@/stores/transcriptionStore";

export const ChatButton = () => {
  const t = useTranslations("chat");
  const { isOpen, setOpen } = useTextChat();
  const autoSendToChat = useTranscriptionStore((state) => state.autoSendToChat);
  const setAutoSendToChat = useTranscriptionStore(
    (state) => state.setAutoSendToChat,
  );

  return (
    <ButtonGroup>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={autoSendToChat ? "default" : "outline"}
            size="icon-lg"
            aria-label={t("toggleAutoSend")}
            aria-pressed={autoSendToChat}
            onClick={() => setAutoSendToChat(!autoSendToChat)}
          >
            <MessageSquareShare />
          </Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={6}>{t("toggleAutoSend")}</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isOpen ? "default" : "outline"}
            size="icon-lg"
            aria-label={t("title")}
            aria-pressed={isOpen}
            onClick={() => setOpen(!isOpen)}
          >
            <MessageSquare />
          </Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={6}>{t("title")}</TooltipContent>
      </Tooltip>
    </ButtonGroup>
  );
};
