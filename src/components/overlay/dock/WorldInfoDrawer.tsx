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

          <div className="px-4 pb-6 space-y-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              The concept of this world and basic controls will be displayed
              here. This is a placeholder for now.
            </p>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Controls</h3>
              <div className="space-y-2.5">
                <div className="flex items-start gap-3">
                  <Kbd className="min-w-20 justify-center">WASD</Kbd>
                  <span className="text-sm text-muted-foreground">
                    Move around
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Kbd className="min-w-20 justify-center gap-1">
                    <Mouse className="size-3" />
                    Mouse
                  </Kbd>
                  <span className="text-sm text-muted-foreground">
                    Look around
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
