"use client";

import { useMultibandTrackVolume } from "@livekit/components-react";
import type { LocalAudioTrack } from "livekit-client";
import { cn } from "@/lib/utils";

interface WaveformProps {
  track?: LocalAudioTrack;
  barCount?: number;
  className?: string;
}

export const Waveform = ({
  track,
  barCount = 20,
  className = "",
}: WaveformProps) => {
  const volumeBands = useMultibandTrackVolume(track, {
    bands: barCount,
    loPass: 0,
    hiPass: 300,
  });

  const calculateBarHeight = (volume: number) => {
    const minHeight = 10;
    const maxHeight = 90;
    return Math.min(maxHeight, Math.max(minHeight, volume * 100 + 5));
  };

  if (!track) return null;

  return (
    <div className={cn("flex items-center justify-center gap-0.5", className)}>
      {volumeBands.map((volume, index) => {
        const barId = `${track?.sid || "waveform"}-${index}`;
        return (
          <div
            key={barId}
            className="w-1 rounded-full bg-primary transition-all duration-75"
            style={{
              height: `${calculateBarHeight(volume)}%`,
            }}
          />
        );
      })}
    </div>
  );
};
