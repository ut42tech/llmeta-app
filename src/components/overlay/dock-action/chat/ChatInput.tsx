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

interface ChatInputProps {
  canSend: boolean;
  onSend: (message: string) => Promise<void>;
  onTypingChange?: (isTyping: boolean) => void;
}

export function ChatInput({ canSend, onSend, onTypingChange }: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  const clearTyping = useTypingDebounce(
    inputValue.trim().length > 0,
    onTypingChange || (() => {}),
  );

  const handleSend = async () => {
    if (!inputValue.trim() || !canSend) {
      return;
    }

    clearTyping();
    await onSend(inputValue.trim());
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSend();
      }}
      className="flex w-full items-center gap-2"
    >
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
        maxLength={500}
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
}
