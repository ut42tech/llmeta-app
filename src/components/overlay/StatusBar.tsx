"use client";

import { CaptionStatusBadge } from "@/components/overlay/status-bar/CaptionStatusBadge";
import { ConnectionStatusBadge } from "@/components/overlay/status-bar/ConnectionStatusBadge";
import { OnlinePlayersBadge } from "@/components/overlay/status-bar/OnlinePlayersBadge";
import { useConnectionStore } from "@/stores/connectionStore";
import { useTranscriptionStore } from "@/stores/transcriptionStore";

export const StatusBar = () => {
  const status = useConnectionStore((state) => state.status);
  const error = useConnectionStore((state) => state.error);
  const isStreaming = useTranscriptionStore((state) => state.isStreaming);

  return (
    <div className="absolute inset-x-4 top-4 flex items-start justify-between pointer-events-auto">
      <CaptionStatusBadge isStreaming={isStreaming} />
      <ConnectionStatusBadge status={status} error={error} />
      <OnlinePlayersBadge />
    </div>
  );
};
