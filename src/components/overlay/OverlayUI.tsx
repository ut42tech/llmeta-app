"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  type ConnectionStatus,
  useConnectionStore,
} from "@/stores/connectionStore";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";
import { useRemotePlayersStore } from "@/stores/remotePlayersStore";

type Props = {
  className?: string;
};

const statusConfig: Record<
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

export const OverlayUI = ({ className }: Props) => {
  const status = useConnectionStore((state) => state.status);
  const error = useConnectionStore((state) => state.error);
  const playersCount = useRemotePlayersStore((state) => state.players.size);
  const sessionId = useLocalPlayerStore((state) => state.sessionId);
  const username = useLocalPlayerStore((state) => state.username);

  const cfg = statusConfig[status] ?? statusConfig.idle;

  return (
    <div className={cn("fixed inset-0 p-4 pointer-events-none", className)}>
      <TooltipProvider>
        <div className="flex flex-col gap-2 max-w-sm pointer-events-auto">
          <Card className="/backdrop-blur supports-[backdrop-filter]:bg-background/70">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base">Overlay</CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="secondary"
                      className={cn("flex items-center gap-2", cfg.badgeClass)}
                    >
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full shadow-inner",
                          cfg.dotClass,
                        )}
                      />
                      {cfg.label}
                    </Badge>
                  </TooltipTrigger>
                  {status === "failed" && (
                    <TooltipContent side="left" className="max-w-xs">
                      <p className="text-xs leading-snug">
                        {error ? String(error) : "Unknown error"}
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="grid grid-cols-3 items-center gap-2">
                <div className="col-span-1 text-muted-foreground">Players</div>
                <div className="col-span-2 font-medium">{playersCount}</div>
              </div>

              <Separator />

              <div className="grid grid-cols-3 items-center gap-2">
                <div className="col-span-1 text-muted-foreground">Session</div>
                <div className="col-span-2 font-mono text-xs break-all">
                  {sessionId || "—"}
                </div>
              </div>

              <div className="grid grid-cols-3 items-center gap-2">
                <div className="col-span-1 text-muted-foreground">
                  Your name
                </div>
                <div className="col-span-2 font-medium">
                  {username || "Player"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TooltipProvider>
    </div>
  );
};
