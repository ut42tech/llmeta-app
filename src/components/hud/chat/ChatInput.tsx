"use client";

import { ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ChatInputProps = {
  canSend: boolean;
  onSend: (message: string) => Promise<void>;
};

const MAX_MESSAGE_LENGTH = 500;

export const ChatInput = ({ canSend, onSend }: ChatInputProps) => {
  const t = useTranslations("chat");
  const tCommon = useTranslations("common");
  const [inputValue, setInputValue] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  const handleSend = async () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue || !canSend) return;

    await onSend(trimmedValue);
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
    <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        placeholder={t("placeholder")}
        disabled={!canSend}
        aria-label={t("inputAriaLabel")}
        className="flex-1"
        maxLength={MAX_MESSAGE_LENGTH}
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="submit"
            disabled={!canSend || !inputValue.trim()}
            size="icon"
            aria-label={tCommon("send")}
          >
            <ArrowUp className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">{tCommon("send")}</TooltipContent>
      </Tooltip>
    </form>
  );
};
