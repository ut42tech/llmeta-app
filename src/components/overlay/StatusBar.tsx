"use client";

import { CaptionStatusBadge } from "@/components/overlay/CaptionStatusBadge";
import { ConnectionStatusBadge } from "@/components/overlay/ConnectionStatusBadge";
import { OnlinePlayersBadge } from "@/components/overlay/OnlinePlayersBadge";
import { useConnectionStore } from "@/stores/connectionStore";
import { useTranscriptionStore } from "@/stores/transcriptionStore";

export const StatusBar = () => {
  const status = useConnectionStore((state) => state.status);
  const error = useConnectionStore((state) => state.error);
  const isStreaming = useTranscriptionStore((state) => state.isStreaming);

  return (
    <>
      <div className="absolute right-4 top-4 pointer-events-auto">
        <OnlinePlayersBadge />
      </div>

      <div className="absolute left-1/2 top-4 -translate-x-1/2 pointer-events-auto">
        <ConnectionStatusBadge status={status} error={error} />
      </div>

      <div className="absolute left-4 top-4 pointer-events-auto">
        <CaptionStatusBadge isStreaming={isStreaming} />
      </div>
    </>
  );
};
