"use client";

import { BotMessageSquareIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useChatStore } from "@/stores/chatStore";

export const AIChatButton = () => {
  const t = useTranslations("dock");
  const isOpen = useChatStore((state) => state.aiChat.isOpen);
  const toggle = useChatStore((state) => state.toggleAIChat);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={isOpen ? "default" : "outline"}
          size="lg"
          onClick={toggle}
        >
          <BotMessageSquareIcon />
          {t("agent")}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{t("aiAgent")}</p>
      </TooltipContent>
    </Tooltip>
  );
};
