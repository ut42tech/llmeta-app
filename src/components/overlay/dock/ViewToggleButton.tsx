"use client";

import { Camera, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";

export const ViewToggleButton = () => {
  const isFPV = useLocalPlayerStore((state) => state.isFPV);
  const toggleFPV = useLocalPlayerStore((state) => state.toggleFPV);

  const label = isFPV ? "Third-person view" : "First-person view";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon-lg"
          variant="outline"
          aria-label={label}
          aria-pressed={isFPV}
          onClick={toggleFPV}
        >
          <Video />
        </Button>
      </TooltipTrigger>
      <TooltipContent sideOffset={6} className="flex items-center gap-2">
        {label}
        <Kbd>V</Kbd>
      </TooltipContent>
    </Tooltip>
  );
};
