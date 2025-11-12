"use client";

import { Info, User, Users, X } from "lucide-react";
import { type ReactNode, useState } from "react";
import { ConnectionStatusBadge } from "@/components/overlay/ConnectionStatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useConnectionStore } from "@/stores/connectionStore";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";
import { useRemotePlayersStore } from "@/stores/remotePlayersStore";

export const OverlayUI = () => {
  const status = useConnectionStore((state) => state.status);
  const error = useConnectionStore((state) => state.error);
  const playersCount = useRemotePlayersStore((state) => state.players.size);
  const username = useLocalPlayerStore((s) => s.username) || "Player";
  const sessionId = useLocalPlayerStore((s) => s.sessionId) || "—";

  const [openPanel, setOpenPanel] = useState<null | "world-info" | "your-info">(
    null,
  );

  const actions: {
    key: string;
    label: string;
    icon: ReactNode;
    onClick?: () => void;
  }[] = [
    {
      key: "world-info",
      label: "About this world",
      icon: <Info />,
    },
    {
      key: "your-info",
      label: "Your info",
      icon: <User />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <TooltipProvider>
        <div className="absolute left-4 top-4 pointer-events-auto">
          <Badge variant="secondary" className="flex items-center gap-1.5">
            <Users className="size-3.5" />
            <span className="tabular-nums">
              {playersCount} Online Player(s)
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

        <div className="absolute left-1/2 bottom-6 -translate-x-1/2 pointer-events-auto">
          <div className="flex items-center gap-3">
            {actions.map((a) => (
              <Tooltip key={a.key}>
                <TooltipTrigger asChild>
                  <Button
                    size="icon-lg"
                    variant="secondary"
                    aria-label={a.label}
                    onClick={() =>
                      setOpenPanel(a.key as "world-info" | "your-info")
                    }
                  >
                    {a.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={6}>{a.label}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        {openPanel && (
          <div className="absolute inset-0 pointer-events-auto">
            <button
              type="button"
              aria-label="Close"
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpenPanel(null)}
            />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(92vw,28rem)]">
              <Card className="relative">
                <CardHeader className="pb-0">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-base">
                      {openPanel === "world-info"
                        ? "About this world"
                        : "Your info"}
                    </CardTitle>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Close"
                      onClick={() => setOpenPanel(null)}
                    >
                      <X />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 text-sm">
                  {openPanel === "world-info" ? (
                    <div className="grid gap-3">
                      <p>
                        The concept of this world and basic controls will be
                        displayed here. This is a placeholder for now.
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Move with WASD / Arrow keys</li>
                        <li>Look around with the mouse</li>
                        <li>Explore together with other players</li>
                      </ul>
                    </div>
                  ) : (
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Username</span>
                        <span className="font-medium">{username}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Session ID
                        </span>
                        <span className="font-mono text-xs break-all">
                          {sessionId}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </TooltipProvider>
    </div>
  );
};
