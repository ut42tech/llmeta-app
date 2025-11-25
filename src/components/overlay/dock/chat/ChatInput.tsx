"use client";

import { ArrowUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTypingDebounce } from "@/hooks/useTypingDebounce";

type ChatInputProps = {
  canSend: boolean;
  onSend: (message: string) => Promise<void>;
  onTypingChange?: (isTyping: boolean) => void;
};

const MAX_MESSAGE_LENGTH = 500;

export const ChatInput = ({
  canSend,
  onSend,
  onTypingChange,
}: ChatInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  const clearTyping = useTypingDebounce(
    inputValue.trim().length > 0,
    onTypingChange ?? (() => {}),
  );

  const handleSend = async () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue || !canSend) return;

    clearTyping();
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
        placeholder="Type a message"
        disabled={!canSend}
        aria-label="Chat message"
        className="flex-1"
        maxLength={MAX_MESSAGE_LENGTH}
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="submit"
            disabled={!canSend || !inputValue.trim()}
            size="icon"
            aria-label="Send message"
          >
            <ArrowUp className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Send message</TooltipContent>
      </Tooltip>
    </form>
  );
};
