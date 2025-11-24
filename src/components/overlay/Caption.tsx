"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MAX_CAPTION_ENTRIES } from "@/constants/transcription";
import { useTranscription } from "@/hooks/useTranscription";
import { cn } from "@/lib/utils";
import { useTranscriptionStore } from "@/stores/transcriptionStore";

export const Caption = () => {
  useTranscription();

  const entries = useTranscriptionStore((state) => state.entries);
  const partial = useTranscriptionStore((state) => state.partial);
  const isStreaming = useTranscriptionStore((state) => state.isStreaming);
  const error = useTranscriptionStore((state) => state.error);

  // Get recent entries in reverse order
  const recentEntries = entries.slice(-MAX_CAPTION_ENTRIES).reverse();
  const [latestEntry, ...olderEntries] = recentEntries;

  // Show partial text if available, otherwise show the latest entry
  const highlightText = partial ?? latestEntry?.text;

  // Show older entries, but hide the latest if we're showing partial text
  const supportingEntries = partial ? recentEntries : olderEntries;

  if (!highlightText && !isStreaming && !error) {
    return null;
  }

  return (
    <div className="absolute right-4 bottom-18 w-full max-w-sm pointer-events-auto">
      <Card className="rounded-2xl border-white/10 bg-black/70 shadow-2xl backdrop-blur gap-3 py-4">
        <CardHeader className="px-4 pb-0">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white/60">
              Live Caption (You)
            </span>
            <Badge
              variant={isStreaming ? "default" : "outline"}
              className={cn(
                "gap-1 text-xs",
                isStreaming
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                  : "text-white/40 border-white/20",
              )}
            >
              <span
                className={cn(
                  "block size-2 rounded-full",
                  isStreaming ? "bg-emerald-300 animate-pulse" : "bg-white/30",
                )}
              />
              {isStreaming ? "Listening" : "Muted"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="px-4 space-y-3">
          {highlightText ? (
            <p className="text-base font-medium text-white">{highlightText}</p>
          ) : (
            <p className="text-base text-white/60">
              {isStreaming
                ? "Start speaking to see captions in real time"
                : "Enable your mic to start transcribing"}
            </p>
          )}

          {supportingEntries.length > 0 && (
            <ScrollArea className="max-h-32">
              <div className="space-y-1.5 text-sm text-white/70 pr-4">
                {supportingEntries.map((entry) => (
                  <p key={entry.id} className="truncate">
                    {entry.text}
                  </p>
                ))}
              </div>
            </ScrollArea>
          )}

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-100">
              {error}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
