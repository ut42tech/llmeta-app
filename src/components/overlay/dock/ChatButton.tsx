"use client";

import { MessageSquare, MessageSquareShare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTextChat } from "@/hooks/useTextChat";
import { useTranscriptionStore } from "@/stores/transcriptionStore";

export const ChatButton = () => {
  const { isOpen, setOpen, unreadCount } = useTextChat();
  const autoSendToChat = useTranscriptionStore((state) => state.autoSendToChat);
  const setAutoSendToChat = useTranscriptionStore(
    (state) => state.setAutoSendToChat,
  );

  return (
    <div className="relative">
      <ButtonGroup>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={autoSendToChat ? "default" : "outline"}
              size="icon-lg"
              aria-label="Auto-send transcription to chat"
              aria-pressed={autoSendToChat}
              onClick={() => setAutoSendToChat(!autoSendToChat)}
            >
              <MessageSquareShare />
            </Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={6}>
            {autoSendToChat
              ? "Disable auto-send transcription to chat"
              : "Enable auto-send transcription to chat"}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isOpen ? "default" : "outline"}
              size="icon-lg"
              aria-label="Chat"
              aria-pressed={isOpen}
              onClick={() => setOpen(!isOpen)}
            >
              <MessageSquare />
            </Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={6}>Chat</TooltipContent>
        </Tooltip>
      </ButtonGroup>

      {/* Unread Badge */}
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -right-2 -top-2 size-6 p-0 flex items-center justify-center pointer-events-none"
        >
          {unreadCount}
        </Badge>
      )}
    </div>
  );
};
