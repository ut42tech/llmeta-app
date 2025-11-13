"use client";

import { Info, Mouse } from "lucide-react";
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
import { Kbd } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const WorldInfoDrawer = () => {
  return (
    <Drawer>
      <Tooltip>
        <TooltipTrigger asChild>
          <DrawerTrigger asChild>
            <Button
              size="icon-lg"
              variant="secondary"
              aria-label="About this world"
            >
              <Info />
            </Button>
          </DrawerTrigger>
        </TooltipTrigger>
        <TooltipContent sideOffset={6}>About this world</TooltipContent>
      </Tooltip>

      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-2xl font-bold">
              About this world
            </DrawerTitle>

            <DrawerDescription className="p-3 bg-neutral-100 rounded-lg">
              💫 Explore together with other players in real-time
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-6">
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The concept of this world and basic controls will be displayed
                  here. This is a placeholder for now.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Controls</h3>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <Kbd className="px-2 py-1 text-xs font-semibold bg-muted rounded border border-border">
                        WASD
                      </Kbd>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Move around
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <Kbd className="px-2 py-1 text-xs font-semibold bg-muted rounded border border-border">
                        <Mouse />
                        Mouse
                      </Kbd>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Look around
                    </span>
                  </div>
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
