"use client";

import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
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
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-2xl font-bold">Your info</DrawerTitle>

            <DrawerDescription className="p-3 bg-neutral-100 rounded-lg">
              🎮 Your session is active and syncing with the server
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-6">
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-sm font-medium text-muted-foreground">
                    Username
                  </span>
                  <span className="text-base font-semibold">{username}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-sm font-medium text-muted-foreground">
                    Session ID
                  </span>
                  <span className="font-mono text-xs text-foreground/80 break-all max-w-[200px] text-right">
                    {sessionId}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
