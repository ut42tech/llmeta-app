"use client";

import { Camera } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLocalPlayerStore } from "@/stores";

export const ViewToggleButton = () => {
  const t = useTranslations("viewToggle");
  const isFPV = useLocalPlayerStore((state) => state.isFPV);
  const toggleFPV = useLocalPlayerStore((state) => state.toggleFPV);

  const label = isFPV ? t("thirdPerson") : t("firstPerson");

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
          <Camera />
        </Button>
      </TooltipTrigger>
      <TooltipContent sideOffset={6} className="flex items-center gap-2">
        {label}
        <Kbd>V</Kbd>
      </TooltipContent>
    </Tooltip>
  );
};
