"use client";

import { useTranslations } from "next-intl";
import { Waveform } from "@/components/hud/caption/Waveform";
import { Badge } from "@/components/ui/badge";
import { useTranscription, useTranscriptionAutoSend } from "@/hooks";
import { cn } from "@/lib/utils";
import { useTranscriptionStore, useVoiceChatStore } from "@/stores";

export const CaptionWindow = () => {
  useTranscription();
  useTranscriptionAutoSend();

  const t = useTranslations("caption");
  const entries = useTranscriptionStore((state) => state.entries);
  const partial = useTranscriptionStore((state) => state.partial);
  const error = useTranscriptionStore((state) => state.error);
  const track = useVoiceChatStore((state) => state.track);

  const text = partial || entries.at(-1)?.text;

  return (
    <div className="pointer-events-auto absolute top-12 left-4">
      <Badge
        variant="secondary"
        className={cn(
          "flex max-w-sm items-center gap-2 px-2.5 py-1.5",
          "border-white/20 bg-white/50 backdrop-blur-md",
          error && "border-red-500/30 bg-red-500/20 text-red-900",
        )}
      >
        <div className="h-4 w-16 shrink-0 overflow-hidden rounded-full bg-white/50">
          <Waveform track={track} className="h-full w-full" />
        </div>

        <p
          className={cn(
            "wrap-break-word text-xs",
            !text && "italic opacity-50",
          )}
        >
          {error ?? text ?? t("waitingForSpeech")}
        </p>
      </Badge>
    </div>
  );
};
