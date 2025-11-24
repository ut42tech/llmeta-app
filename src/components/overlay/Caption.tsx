"use client";

import { Waveform } from "@/components/overlay/Waveform";
import { useTranscription } from "@/hooks/useTranscription";
import { cn } from "@/lib/utils";
import { useTranscriptionStore } from "@/stores/transcriptionStore";
import { useVoiceChatStore } from "@/stores/voiceChatStore";

export const Caption = () => {
  useTranscription();

  const entries = useTranscriptionStore((state) => state.entries);
  const partial = useTranscriptionStore((state) => state.partial);
  const isStreaming = useTranscriptionStore((state) => state.isStreaming);
  const error = useTranscriptionStore((state) => state.error);
  const track = useVoiceChatStore((state) => state.track);

  const text = partial || entries.at(-1)?.text;

  if (!text && !isStreaming && !error) return null;

  return (
    <div className="absolute right-6 bottom-6 w-56 pointer-events-auto">
      <div className="rounded-lg border border-white/10 bg-black/80 backdrop-blur p-3 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/40">Live Caption</span>
          <div
            className={cn(
              "flex items-center gap-1.5",
              isStreaming ? "text-emerald-400" : "text-white/20",
            )}
          >
            <div
              className={cn(
                "size-1.5 rounded-full bg-current",
                isStreaming && "animate-pulse",
              )}
            />
            <span>{isStreaming ? "ON" : "OFF"}</span>
          </div>
        </div>

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
