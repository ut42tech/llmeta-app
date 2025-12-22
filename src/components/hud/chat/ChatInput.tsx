"use client";

import { ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTextChat } from "@/hooks/useTextChat";

const MAX_MESSAGE_LENGTH = 500;

export const ChatInput = () => {
  const t = useTranslations("chat");
  const tCommon = useTranslations("common");
  const { canSend, sendMessage } = useTextChat();
  const [inputValue, setInputValue] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  const handleSend = async () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue || !canSend) return;

    await sendMessage(trimmedValue);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      void handleSend();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void handleSend();
  };

  return (
    <TooltipProvider>
      <form onSubmit={handleSubmit} className="flex items-center gap-2 w-64">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder={t("placeholder")}
          disabled={!canSend}
          aria-label={t("inputAriaLabel")}
          className="h-11 flex-1 rounded-full bg-black/20 backdrop-blur-sm border-0 px-4 text-sm text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-white/30"
          maxLength={MAX_MESSAGE_LENGTH}
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="submit"
              disabled={!canSend || !inputValue.trim()}
              size="icon-lg"
              className="rounded-full"
              aria-label={tCommon("send")}
            >
              <ArrowUp className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={6} className="flex items-center gap-2">
            {tCommon("send")}
            <Kbd>Enter</Kbd>
          </TooltipContent>
        </Tooltip>
      </form>
    </TooltipProvider>
  );
};
