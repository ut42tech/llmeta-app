"use client";

import { Info, Mouse } from "lucide-react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("worldInfo");
  const tCommon = useTranslations("common");

  return (
    <Drawer>
      <Tooltip>
        <TooltipTrigger asChild>
          <DrawerTrigger asChild>
            <Button size="icon-lg" variant="outline" aria-label={t("tooltip")}>
              <Info />
            </Button>
          </DrawerTrigger>
        </TooltipTrigger>
        <TooltipContent sideOffset={6}>{t("tooltip")}</TooltipContent>
      </Tooltip>

      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-2xl font-bold">
              {t("title")}
            </DrawerTitle>
            <DrawerDescription className="p-3 bg-neutral-100 rounded-lg">
              {t("description")}
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-6 space-y-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("placeholder")}
            </p>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold">{t("controlsTitle")}</h3>
              <div className="space-y-2.5">
                <div className="flex items-start gap-3">
                  <Kbd className="min-w-20 justify-center">WASD</Kbd>
                  <span className="text-sm text-muted-foreground">
                    {t("moveAround")}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Kbd className="min-w-20 justify-center gap-1">
                    <Mouse className="size-3" />
                    Mouse
                  </Kbd>
                  <span className="text-sm text-muted-foreground">
                    {t("lookAround")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                {tCommon("close")}
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
