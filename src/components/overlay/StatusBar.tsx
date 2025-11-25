"use client";

import { Users } from "lucide-react";
import { CaptionStatusBadge } from "@/components/overlay/CaptionStatusBadge";
import { ConnectionStatusBadge } from "@/components/overlay/ConnectionStatusBadge";
import { Badge } from "@/components/ui/badge";
import { useConnectionStore } from "@/stores/connectionStore";
import { useRemotePlayersStore } from "@/stores/remotePlayersStore";
import { useTranscriptionStore } from "@/stores/transcriptionStore";

export const StatusBar = () => {
  const status = useConnectionStore((state) => state.status);
  const error = useConnectionStore((state) => state.error);
  const playersCount = useRemotePlayersStore((state) => state.players.size);
  const isStreaming = useTranscriptionStore((state) => state.isStreaming);

  return (
    <>
      <div className="absolute left-4 top-4 pointer-events-auto">
        <Badge variant="secondary" className="flex items-center gap-1.5">
          <Users className="size-3.5" />
          <span className="tabular-nums">
            {playersCount + 1} Online Player(s)
          </span>
        </Badge>
      </div>

      <div className="absolute left-1/2 top-4 -translate-x-1/2 pointer-events-auto">
        <ConnectionStatusBadge status={status} error={error} />
      </div>

      <div className="absolute right-4 top-4 pointer-events-auto">
        <CaptionStatusBadge isStreaming={isStreaming} />
      </div>
    </>
  );
};
