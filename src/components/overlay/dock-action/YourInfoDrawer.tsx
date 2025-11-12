"use client";

import { User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";

export const YourInfoDrawer = () => {
  const username = useLocalPlayerStore((s) => s.username) || "Player";
  const sessionId = useLocalPlayerStore((s) => s.sessionId) || "—";

  return (
    <Drawer>
      <Tooltip>
        <TooltipTrigger asChild>
          <DrawerTrigger asChild>
            <Button size="icon-lg" variant="secondary" aria-label="Your info">
              <User />
            </Button>
          </DrawerTrigger>
        </TooltipTrigger>
        <TooltipContent sideOffset={6}>Your info</TooltipContent>
      </Tooltip>

      <DrawerContent>
        <DrawerHeader>
          <div className="flex items-center justify-between gap-3">
            <DrawerTitle>Your info</DrawerTitle>
            <DrawerClose asChild>
              <Button size="icon" variant="ghost" aria-label="Close">
                <X />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        <div className="px-4 pb-4 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Username</span>
              <span className="font-medium">{username}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Session ID</span>
              <span className="font-mono text-xs break-all">{sessionId}</span>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
