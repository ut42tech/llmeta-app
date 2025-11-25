"use client";

import { Waveform } from "@/components/overlay/Waveform";
import { useTranscription } from "@/hooks/useTranscription";
import { cn } from "@/lib/utils";
import { useTranscriptionStore } from "@/stores/transcriptionStore";
import { useVoiceChatStore } from "@/stores/voiceChatStore";

export const CaptionWindow = () => {
  useTranscription();
  const entries = useTranscriptionStore((state) => state.entries);
  const partial = useTranscriptionStore((state) => state.partial);
  const isStreaming = useTranscriptionStore((state) => state.isStreaming);
  const error = useTranscriptionStore((state) => state.error);
  const track = useVoiceChatStore((state) => state.track);

  const text = partial || entries.at(-1)?.text;

  if (!text && !isStreaming && !error) return null;

  return (
    <div className="absolute right-4 top-16 w-64 pointer-events-auto">
      <div className="rounded-lg border border-white/10 bg-black/80 backdrop-blur p-3 space-y-3">
        <div className="h-6 rounded-full bg-white/5 overflow-hidden">
          <Waveform track={track} className="h-full w-full" />
        </div>

        <div className="min-h-5">
          {error ? (
            <p className="text-xs text-red-400">{error}</p>
          ) : (
            <p
              className={cn(
                "text-xs leading-relaxed",
                text ? "text-white" : "text-white/30 italic",
              )}
            >
              {text || "Waiting for speech..."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
