"use client";

import { Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRemotePlayersStore } from "@/stores";

export const OnlinePlayersBadge = () => {
  const t = useTranslations("statusBar");
  const playersCount = useRemotePlayersStore(
    (s) => Object.keys(s.players).length,
  );
  const totalCount = playersCount + 1;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="secondary" className="flex items-center gap-1.5">
          <Users className="size-3.5" />
          <span className="tabular-nums">
            {totalCount} {totalCount === 1 ? t("player") : t("players")}
          </span>
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        {totalCount === 1
          ? t("onlyPlayerOnline")
          : t("playersOnline", { count: totalCount })}
      </TooltipContent>
    </Tooltip>
  );
};
