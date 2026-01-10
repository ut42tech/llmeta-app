"use client";

import { Gamepad2, Globe, Settings } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Kbd } from "@/components/ui/kbd";
import {
  SettingsSection,
  staggerContainer,
  staggerItem,
} from "./SettingsShared";

export const ControlsTab = () => {
  const t = useTranslations("worldInfo");

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Introduction */}
      <motion.p
        className="text-muted-foreground text-sm leading-relaxed"
        variants={staggerItem}
      >
        {t("intro")}
      </motion.p>

      {/* Movement & Camera */}
      <SettingsSection
        title={t("controlsTitle")}
        icon={<Gamepad2 className="size-4 text-muted-foreground" />}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Kbd className="min-w-16 justify-center">WASD</Kbd>
            <span className="text-muted-foreground text-sm">{t("move")}</span>
          </div>
          <div className="flex items-center gap-3">
            <Kbd className="min-w-16 justify-center">Space</Kbd>
            <span className="text-muted-foreground text-sm">{t("jump")}</span>
          </div>
          <div className="flex items-center gap-3">
            <Kbd className="min-w-16 justify-center">Shift</Kbd>
            <span className="text-muted-foreground text-sm">{t("run")}</span>
          </div>
          <div className="flex items-center gap-3">
            <Kbd className="min-w-16 justify-center">Drag</Kbd>
            <span className="text-muted-foreground text-sm">
              {t("lookAround")}
            </span>
          </div>
        </div>
      </SettingsSection>

      {/* Keyboard Shortcuts */}
      <SettingsSection
        title={t("shortcutsTitle")}
        icon={<Settings className="size-4 text-muted-foreground" />}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Kbd className="min-w-16 justify-center">V</Kbd>
            <span className="text-muted-foreground text-sm">
              {t("toggleView")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Kbd className="min-w-16 justify-center">M</Kbd>
            <span className="text-muted-foreground text-sm">
              {t("toggleMic")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Kbd className="min-w-16 justify-center">P</Kbd>
            <span className="text-muted-foreground text-sm">
              {t("openPreferences")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Kbd className="min-w-16 justify-center">/</Kbd>
            <span className="text-muted-foreground text-sm">
              {t("openAIChat")}
            </span>
          </div>
        </div>
      </SettingsSection>

      {/* Communication */}
      <SettingsSection
        title={t("communicationTitle")}
        icon={<Globe className="size-4 text-muted-foreground" />}
      >
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t("voiceChatDesc")}
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t("textChatDesc")}
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t("aiChatDesc")}
          </p>
        </div>
      </SettingsSection>
    </motion.div>
  );
};
