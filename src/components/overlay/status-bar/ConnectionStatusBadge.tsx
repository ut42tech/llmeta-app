"use client";

import { Server } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { ConnectionStatus } from "@/stores/connectionStore";

type ConnectionStatusBadgeProps = {
  status: ConnectionStatus;
  error?: unknown;
  className?: string;
};

const STATUS_CONFIG: Record<
  ConnectionStatus,
  { label: string; dotClass: string; badgeClass?: string }
> = {
  idle: { label: "Idle", dotClass: "bg-zinc-400" },
  connecting: { label: "Connecting…", dotClass: "bg-yellow-500" },
  connected: { label: "Connected", dotClass: "bg-green-500" },
  failed: {
    label: "Connection Failed",
    dotClass: "bg-red-500",
    badgeClass: "bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-300",
  },
  disconnected: { label: "Disconnected", dotClass: "bg-zinc-400" },
};

export const ConnectionStatusBadge = ({
  status,
  error,
  className,
}: ConnectionStatusBadgeProps) => {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.idle;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="secondary"
          className={cn(
            "flex items-center gap-2",
            config.badgeClass,
            className,
          )}
        >
          <Server className="size-3.5" />
          <span>{config.label}</span>
          {status === "connecting" && (
            <Spinner aria-label="Connecting" className="size-3.5" />
          )}
          <span
            className={cn("size-2 rounded-full shadow-inner", config.dotClass)}
          />
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        {status === "failed"
          ? error
            ? String(error)
            : "Connection failed due to an unknown error."
          : "Server connection status"}
      </TooltipContent>
    </Tooltip>
  );
};
