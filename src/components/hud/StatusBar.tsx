"use client";

import { CaptionStatusBadge } from "@/components/hud/status-bar/CaptionStatusBadge";
import { ConnectionStatusBadge } from "@/components/hud/status-bar/ConnectionStatusBadge";
import { OnlinePlayersBadge } from "@/components/hud/status-bar/OnlinePlayersBadge";
import { useTranscriptionStore, useWorldStore } from "@/stores";

export const StatusBar = () => {
  const status = useWorldStore((state) => state.connection.status);
  const error = useWorldStore((state) => state.connection.error);
  const isStreaming = useTranscriptionStore((state) => state.isStreaming);

  return (
    <div className="pointer-events-auto absolute inset-x-4 top-4 grid grid-cols-3 items-start">
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
