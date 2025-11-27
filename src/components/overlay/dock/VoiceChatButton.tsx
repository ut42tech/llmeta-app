"use client";

import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useVoiceChat } from "@/hooks/voice/useVoiceChat";

export const VoiceChatButton = () => {
  const { status, toggleMic, canPublish } = useVoiceChat();

  const isBusy = status.isPublishing;
  const isActive = status.isMicEnabled;
  const permissionDenied = status.permission === "denied";
  const disabled = !canPublish || isBusy || permissionDenied;

  const tooltipLabel = (() => {
    if (status.error) return status.error;
    if (!canPublish) return "Connect to a room to talk";
    if (permissionDenied) return "Microphone permission denied";
    return isActive ? "Mute microphone" : "Unmute microphone";
  })();

  const handleToggle = () => {
    if (disabled) return;
    void toggleMic();
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon-lg"
          variant={isActive ? "default" : "outline"}
          aria-label={isActive ? "Mute microphone" : "Unmute microphone"}
          aria-pressed={isActive}
          disabled={disabled}
          onClick={handleToggle}
        >
          {isActive ? <Mic /> : <MicOff />}
        </Button>
      </TooltipTrigger>
      <TooltipContent sideOffset={6}>{tooltipLabel}</TooltipContent>
    </Tooltip>
  );
};
