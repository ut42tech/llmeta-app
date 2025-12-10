"use client";

import { Mic, MicOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useHotkeys } from "react-hotkeys-hook";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useVoiceChat } from "@/hooks/voice/useVoiceChat";

export const VoiceChatButton = () => {
  const t = useTranslations("voiceChat");
  const { status, toggleMic, canPublish } = useVoiceChat();

  const isBusy = status.isPublishing;
  const isActive = status.isMicEnabled;
  const permissionDenied = status.permission === "denied";
  const disabled = !canPublish || isBusy || permissionDenied;

  const handleToggle = () => {
    if (disabled) return;
    void toggleMic();
  };

  // Toggle microphone with M key
  useHotkeys("m", handleToggle, {
    preventDefault: true,
    enableOnFormTags: false,
  });

  const label = (() => {
    if (status.error) return status.error;
    if (!canPublish) return t("connectToTalk");
    if (permissionDenied) return t("permissionDenied");
    return isActive ? t("mute") : t("unmute");
  })();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon-lg"
          variant={isActive ? "default" : "outline"}
          aria-label={isActive ? t("mute") : t("unmute")}
          aria-pressed={isActive}
          disabled={disabled}
          onClick={handleToggle}
        >
          {isActive ? <Mic /> : <MicOff />}
        </Button>
      </TooltipTrigger>
      <TooltipContent sideOffset={6} className="flex items-center gap-2">
        {label}
        <Kbd>M</Kbd>
      </TooltipContent>
    </Tooltip>
  );
};
