"use client";

import { CaptionStatusBadge } from "@/components/hud/status-bar/CaptionStatusBadge";
import { ConnectionStatusBadge } from "@/components/hud/status-bar/ConnectionStatusBadge";
import { OnlinePlayersBadge } from "@/components/hud/status-bar/OnlinePlayersBadge";
import { useConnectionStore } from "@/stores/connectionStore";
import { useTranscriptionStore } from "@/stores/transcriptionStore";

export const StatusBar = () => {
  const status = useConnectionStore((state) => state.status);
  const error = useConnectionStore((state) => state.error);
  const isStreaming = useTranscriptionStore((state) => state.isStreaming);

  return (
    <div className="absolute inset-x-4 top-4 grid grid-cols-3 items-start pointer-events-auto">
      <div className="justify-self-start">
        <CaptionStatusBadge isStreaming={isStreaming} />
      </div>
      <div className="justify-self-center">
        <ConnectionStatusBadge status={status} error={error} />
      </div>
      <div className="justify-self-end">
        <OnlinePlayersBadge />
      </div>
    </div>
  );
};
