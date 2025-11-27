"use client";

import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { countEntities } from "@/stores/helpers";
import { useRemotePlayersStore } from "@/stores/remotePlayersStore";

export const OnlinePlayersBadge = () => {
  const playersCount = useRemotePlayersStore((s) => countEntities(s.players));
  const totalCount = playersCount + 1;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="secondary" className="flex items-center gap-1.5">
          <Users className="size-3.5" />
          <span className="tabular-nums">
            {totalCount} {totalCount === 1 ? "Player" : "Players"}
          </span>
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        {totalCount === 1
          ? "You are the only player online"
          : `${totalCount} players online (including you)`}
      </TooltipContent>
    </Tooltip>
  );
};
