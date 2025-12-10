"use client";

import { useTranslations } from "next-intl";
import { Waveform } from "@/components/overlay/caption/Waveform";
import { Badge } from "@/components/ui/badge";
import { useTranscription } from "@/hooks/transcription/useTranscription";
import { useTranscriptionAutoSend } from "@/hooks/transcription/useTranscriptionAutoSend";
import { cn } from "@/lib/utils";
import { useTranscriptionStore } from "@/stores/transcriptionStore";
import { useVoiceChatStore } from "@/stores/voiceChatStore";

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
    <div className="absolute left-4 top-12 pointer-events-auto">
      <Badge
        variant="secondary"
        className={cn(
          "flex items-center gap-2 px-2.5 py-1.5 max-w-sm",
          "bg-white/50 backdrop-blur-md border-white/20",
          error && "bg-red-500/20 border-red-500/30 text-red-900",
        )}
      >
        <div className="h-4 w-16 shrink-0 rounded-full bg-white/50 overflow-hidden">
          <Waveform track={track} className="h-full w-full" />
        </div>

        <p
          className={cn(
            "text-xs wrap-break-word",
            !text && "opacity-50 italic",
          )}
        >
          {error ?? text ?? t("waitingForSpeech")}
        </p>
      </Badge>
    </div>
  );
};
