"use client";

import { MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTextChat } from "@/hooks/useTextChat";

export const ChatButton = () => {
  const t = useTranslations("chat");
  const { isOpen, setOpen } = useTextChat();

  return (
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
  );
};
