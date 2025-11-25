"use client";

import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRemotePlayersStore } from "@/stores/remotePlayersStore";

export const OnlinePlayersBadge = () => {
  const playersCount = useRemotePlayersStore((state) => state.players.size);

  return (
    <Badge variant="secondary" className="flex items-center gap-1.5">
      <Users className="size-3.5" />
      <span className="tabular-nums">{playersCount + 1} Online Player(s)</span>
    </Badge>
  );
};
