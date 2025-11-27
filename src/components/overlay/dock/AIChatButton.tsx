"use client";

import { BotMessageSquareIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAIChatStore } from "@/stores/aiChatStore";

export const AIChatButton = () => {
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
          Agent
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>AI Agent</p>
      </TooltipContent>
    </Tooltip>
  );
};
