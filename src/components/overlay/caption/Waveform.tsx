"use client";

import { useMultibandTrackVolume } from "@livekit/components-react";
import type { LocalAudioTrack } from "livekit-client";
import { cn } from "@/lib/utils";

type WaveformProps = {
  track?: LocalAudioTrack;
  barCount?: number;
  className?: string;
};

const MIN_BAR_HEIGHT = 10;
const MAX_BAR_HEIGHT = 90;

const calculateBarHeight = (volume: number): number => {
  return Math.min(MAX_BAR_HEIGHT, Math.max(MIN_BAR_HEIGHT, volume * 100 + 5));
};

export const Waveform = ({
  track,
  barCount = 10,
  className,
}: WaveformProps) => {
  const volumeBands = useMultibandTrackVolume(track, {
    bands: barCount,
    loPass: 0,
    hiPass: 300,
  });

  if (!track) return null;

  return (
    <div className={cn("flex items-center justify-center gap-0.5", className)}>
      {volumeBands.map((volume, index) => {
        const barId = `${track.sid || "waveform"}-${index}`;
        return (
          <div
            key={barId}
            className="w-0.5 rounded-full bg-primary transition-all duration-75"
            style={{ height: `${calculateBarHeight(volume)}%` }}
          />
        );
      })}
    </div>
  );
};
