"use client";

import { Server } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { ConnectionStatus } from "@/stores";

type ConnectionStatusBadgeProps = {
  status: ConnectionStatus;
  error?: unknown;
  className?: string;
};

const STATUS_DOT_CLASSES: Record<ConnectionStatus, string> = {
  idle: "bg-zinc-400",
  connecting: "bg-yellow-500",
  connected: "bg-green-500",
  failed: "bg-red-500",
  disconnected: "bg-zinc-400",
};

const STATUS_BADGE_CLASSES: Partial<Record<ConnectionStatus, string>> = {
  failed: "bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-300",
};

export const ConnectionStatusBadge = ({
  status,
  error,
  className,
}: ConnectionStatusBadgeProps) => {
  const t = useTranslations("statusBar");

  const dotClass = STATUS_DOT_CLASSES[status] ?? STATUS_DOT_CLASSES.idle;
  const badgeClass = STATUS_BADGE_CLASSES[status];

  const statusLabels: Record<ConnectionStatus, string> = {
    idle: t("idle"),
    connecting: t("connecting"),
    connected: t("connected"),
    failed: t("failed"),
    disconnected: t("disconnected"),
  };

  const label = statusLabels[status] ?? statusLabels.idle;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="secondary"
          className={cn("flex items-center gap-2", badgeClass, className)}
        >
          <Server className="size-3.5" />
          <span>{label}</span>
          {status === "connecting" && (
            <Spinner aria-label={t("connecting")} className="size-3.5" />
          )}
          <span className={cn("size-2 rounded-full shadow-inner", dotClass)} />
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        {status === "failed"
          ? error
            ? String(error)
            : t("connectionFailedUnknown")
          : t("connectionStatus")}
      </TooltipContent>
    </Tooltip>
  );
};
