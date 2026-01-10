"use client";

import { Gamepad2, Languages, Settings, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Kbd } from "@/components/ui/kbd";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ControlsTab } from "./ControlsTab";
import { GeneralTab } from "./GeneralTab";
import { LanguageTab } from "./LanguageTab";

const tabContentVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 16 },
};

const SettingsContent = () => {
  const t = useTranslations("settings");
  const [activeTab, setActiveTab] = useState("general");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="general" className="gap-1.5">
          <User className="size-4" />
          {t("tabs.general")}
        </TabsTrigger>
        <TabsTrigger value="controls" className="gap-1.5">
          <Gamepad2 className="size-4" />
          {t("tabs.controls")}
        </TabsTrigger>
        <TabsTrigger value="language" className="gap-1.5">
          <Languages className="size-4" />
          {t("tabs.language")}
        </TabsTrigger>
      </TabsList>

      <motion.div
        className="mt-4"
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <AnimatePresence mode="wait">
          {activeTab === "general" && (
            <motion.div
              key="general"
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <GeneralTab />
            </motion.div>
          )}
          {activeTab === "controls" && (
            <motion.div
              key="controls"
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <ControlsTab />
            </motion.div>
          )}
          {activeTab === "language" && (
            <motion.div
              key="language"
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <LanguageTab />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Tabs>
  );
};

export const SettingsDrawer = () => {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const [isClient, setIsClient] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  useHotkeys("p", handleToggle, {
    preventDefault: true,
    enableOnFormTags: false,
  });

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DrawerTrigger asChild>
            <Button size="icon-lg" variant="outline" aria-label={t("tooltip")}>
              <Settings />
            </Button>
          </DrawerTrigger>
        </TooltipTrigger>
        <TooltipContent sideOffset={6} className="flex items-center gap-2">
          {t("tooltip")}
          <Kbd>P</Kbd>
        </TooltipContent>
      </Tooltip>

      <DrawerContent className="flex flex-col overflow-hidden">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col overflow-hidden">
          <DrawerHeader className="shrink-0 text-center">
            <DrawerTitle className="flex items-center justify-center gap-2 font-bold text-2xl">
              <Settings className="size-6" />
              {t("title")}
            </DrawerTitle>
          </DrawerHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
            {isClient ? (
              <SettingsContent />
            ) : (
              <div className="h-24 rounded-md border border-dashed bg-muted/30" />
            )}
          </div>

          <DrawerFooter className="shrink-0 pt-2">
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
