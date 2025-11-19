"use client";

import { Users } from "lucide-react";
import { ConnectionStatusBadge } from "@/components/overlay/ConnectionStatusBadge";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useConnectionStore } from "@/stores/connectionStore";
import { useRemotePlayersStore } from "@/stores/remotePlayersStore";

export const StatusBar = () => {
  const status = useConnectionStore((state) => state.status);
  const error = useConnectionStore((state) => state.error);
  const playersCount = useRemotePlayersStore((state) => state.players.size);

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
        <div className="flex items-center gap-2">
          {status === "connecting" && (
            <Spinner aria-label="Connecting" className="size-4" />
          )}
          <ConnectionStatusBadge status={status} error={error} />
        </div>
      </div>
    </>
  );
};
