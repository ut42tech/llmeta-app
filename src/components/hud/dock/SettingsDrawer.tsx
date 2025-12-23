"use client";

import {
  Fingerprint,
  Gamepad2,
  Globe,
  Languages,
  Mouse,
  Settings,
  Smile,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useShallow } from "zustand/react/shallow";
import { AvatarPicker } from "@/components/hud/dock/AvatarPicker";
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

import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AVATAR_LIST } from "@/constants/avatars";
import { useSyncClient } from "@/hooks/livekit/useSyncClient";
import type { Locale } from "@/i18n/config";
import { useLanguageStore } from "@/stores/languageStore";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";
import { useWorldStore } from "@/stores/worldStore";
import type { ViverseAvatar } from "@/types/player";

const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

type SettingsSectionProps = {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
};

const SettingsSection = ({ title, icon, children }: SettingsSectionProps) => (
  <motion.div className="space-y-3" variants={staggerItem}>
    <h3 className="text-sm font-semibold flex items-center gap-2">
      {icon}
      {title}
    </h3>
    {children}
  </motion.div>
);

type InfoRowProps = {
  label: string;
  value: string;
  mono?: boolean;
};

const InfoRow = ({ label, value, mono }: InfoRowProps) => (
  <motion.div
    className="flex items-center justify-between py-1.5"
    initial={{ opacity: 0, x: -8 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.2 }}
  >
    <span className="text-sm font-medium text-muted-foreground">{label}</span>
    <span
      className={
        mono
          ? "font-mono text-xs text-foreground/80 break-all max-w-[200px] text-right"
          : "text-base font-semibold"
      }
    >
      {value}
    </span>
  </motion.div>
);

const GeneralTab = () => {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const { sendProfile } = useSyncClient();
  const { roomName, roomSid } = useWorldStore(
    useShallow((state) => ({
      roomName: state.room.roomName || "—",
      roomSid: state.room.roomSid || "—",
    })),
  );

  const {
    username,
    sessionId,
    position,
    rotation,
    setUsername,
    teleport,
    currentAvatar,
    setCurrentAvatar,
  } = useLocalPlayerStore(
    useShallow((state) => ({
      username: state.username || "Anonymous",
      sessionId: state.sessionId || "—",
      position: state.position,
      rotation: state.rotation,
      setUsername: state.setUsername,
      teleport: state.teleport,
      currentAvatar: state.currentAvatar,
      setCurrentAvatar: state.setCurrentAvatar,
    })),
  );

  const [nameInput, setNameInput] = useState(username);

  const isNameChanged = useMemo(
    () => nameInput.trim() !== "" && nameInput.trim() !== username,
    [nameInput, username],
  );

  const handleUpdateName = () => {
    const newName = nameInput.trim();
    if (!newName) return;
    setUsername(newName);
    sendProfile({ username: newName });
  };

  const handleSelectAvatar = (avatar: ViverseAvatar) => {
    const currentPosition = position.clone();
    const currentRotation = rotation.clone();
    setCurrentAvatar(avatar);
    teleport(currentPosition, currentRotation);
    sendProfile({ avatar });
  };

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <SettingsSection
        title={t("username")}
        icon={<User className="size-4 text-muted-foreground" />}
      >
        <div className="flex items-center gap-2">
          <Input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder={t("usernamePlaceholder")}
            className="flex-1"
          />
          <Button onClick={handleUpdateName} disabled={!isNameChanged}>
            {tCommon("update")}
          </Button>
        </div>
      </SettingsSection>

      <SettingsSection
        title={t("avatar")}
        icon={<Smile className="size-4 text-muted-foreground" />}
      >
        <AvatarPicker
          avatars={AVATAR_LIST}
          selectedId={currentAvatar?.id}
          onSelect={handleSelectAvatar}
        />
      </SettingsSection>

      <SettingsSection
        title={t("sessionInfo")}
        icon={<Fingerprint className="size-4 text-muted-foreground" />}
      >
        <InfoRow label={t("roomName")} value={roomName} mono />
        <InfoRow label={t("roomSid")} value={roomSid} mono />
        <InfoRow label={t("sessionId")} value={sessionId} mono />
      </SettingsSection>
    </motion.div>
  );
};

const ControlsTab = () => {
  const t = useTranslations("worldInfo");

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.p
        className="text-sm text-muted-foreground leading-relaxed"
        variants={staggerItem}
      >
        {t("placeholder")}
      </motion.p>

      <motion.div className="space-y-3" variants={staggerItem}>
        <h3 className="text-sm font-semibold">{t("controlsTitle")}</h3>
        <div className="space-y-2.5">
          <motion.div
            className="flex items-start gap-3"
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Kbd className="min-w-20 justify-center">WASD</Kbd>
            <span className="text-sm text-muted-foreground">
              {t("moveAround")}
            </span>
          </motion.div>
          <motion.div
            className="flex items-start gap-3"
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Kbd className="min-w-20 justify-center gap-1">
              <Mouse className="size-3" />
              Mouse
            </Kbd>
            <span className="text-sm text-muted-foreground">
              {t("lookAround")}
            </span>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const languageOptions: { value: Locale; label: string; description: string }[] =
  [
    { value: "en", label: "English", description: "English" },
    { value: "ja", label: "日本語", description: "Japanese" },
  ];

const LanguageTab = () => {
  const t = useTranslations("language");
  const { locale, setLocale } = useLanguageStore();

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <SettingsSection
        title={t("selectLanguage")}
        icon={<Globe className="size-4 text-muted-foreground" />}
      >
        <RadioGroup
          value={locale}
          onValueChange={(v) => setLocale(v as Locale)}
        >
          {languageOptions.map((lang, index) => (
            <motion.div
              key={lang.value}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Label
                htmlFor={`lang-${lang.value}`}
                className="flex items-center gap-4 p-4 rounded-xl border cursor-pointer hover:bg-muted/50 has-[data-state=checked]:border-primary has-[data-state=checked]:bg-primary/5 transition-colors"
              >
                <RadioGroupItem value={lang.value} id={`lang-${lang.value}`} />
                <div className="flex-1">
                  <div className="font-semibold">{lang.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {lang.description}
                  </div>
                </div>
              </Label>
            </motion.div>
          ))}
        </RadioGroup>
      </SettingsSection>
    </motion.div>
  );
};

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
        <div className="mx-auto w-full max-w-md flex flex-col flex-1 overflow-hidden">
          <DrawerHeader className="text-center shrink-0">
            <DrawerTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <Settings className="size-6" />
              {t("title")}
            </DrawerTitle>
          </DrawerHeader>

          <div className="overflow-y-auto flex-1 min-h-0 px-4 pb-6">
            {isClient ? (
              <SettingsContent />
            ) : (
              <div className="h-24 rounded-md border border-dashed bg-muted/30" />
            )}
          </div>

          <DrawerFooter className="pt-2 shrink-0">
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
