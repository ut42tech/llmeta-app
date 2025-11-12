"use client";

import { Info, X } from "lucide-react";
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
        <DrawerHeader>
          <div className="flex items-center justify-between gap-3">
            <DrawerTitle>About this world</DrawerTitle>
            <DrawerClose asChild>
              <Button size="icon" variant="ghost" aria-label="Close">
                <X />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        <div className="px-4 pb-4 text-sm">
          <div className="grid gap-3">
            <p>
              The concept of this world and basic controls will be displayed
              here. This is a placeholder for now.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Move with WASD / Arrow keys</li>
              <li>Look around with the mouse</li>
              <li>Explore together with other players</li>
            </ul>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
