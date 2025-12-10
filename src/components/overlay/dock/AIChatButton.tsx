"use client";

import { BotMessageSquareIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAIChatStore } from "@/stores/aiChatStore";

export const AIChatButton = () => {
  const t = useTranslations("dock");
  const { isOpen, toggle } = useAIChatStore();

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
