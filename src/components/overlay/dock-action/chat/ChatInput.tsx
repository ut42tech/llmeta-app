import { ArrowUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  canSend: boolean;
  onSend: (message: string) => Promise<void>;
}

export function ChatInput({ canSend, onSend }: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  const handleSend = async () => {
    if (!inputValue.trim() || !canSend) {
      return;
    }

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
    <div className="backdrop-blur-md bg-background/80 border border-border/50 rounded-lg shadow-lg p-3">
      <div className="flex gap-2 items-center">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder="Type a message..."
          disabled={!canSend}
          className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
          maxLength={500}
        />
        <Button
          onClick={handleSend}
          disabled={!canSend || !inputValue.trim()}
          size="icon"
          className="shrink-0"
          aria-label="Send"
        >
          <ArrowUp />
        </Button>
      </div>
    </div>
  );
}
