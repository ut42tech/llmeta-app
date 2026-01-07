"use client";

import {
  Fingerprint,
  Gamepad2,
  Globe,
  Languages,
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
import { useAuth } from "@/hooks/auth";
import { useSyncClient } from "@/hooks/livekit/useSyncClient";
import type { Locale } from "@/i18n/config";
import { useAuthStore } from "@/stores/authStore";
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
    <h3 className="flex items-center gap-2 font-semibold text-sm">
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
    <span className="font-medium text-muted-foreground text-sm">{label}</span>
    <span
      className={
        mono
          ? "max-w-50 break-all text-right font-mono text-foreground/80 text-xs"
          : "font-semibold text-base"
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
  const { updateProfile } = useAuth();
  const instanceId = useWorldStore((state) => state.instanceId);

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
    updateProfile({ display_name: newName });
  };

  const handleSelectAvatar = (avatar: ViverseAvatar) => {
    const currentPosition = position.clone();
    const currentRotation = rotation.clone();
    setCurrentAvatar(avatar);
    teleport(currentPosition, currentRotation);
    sendProfile({ avatar });
    updateProfile({ avatar_id: avatar.id });
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
        <InfoRow label={t("instanceId")} value={instanceId || "—"} mono />
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

const languageOptions: { value: Locale; label: string; description: string }[] =
  [
    { value: "en", label: "English", description: "English" },
    { value: "ja", label: "日本語", description: "Japanese" },
  ];

const LanguageTab = () => {
  const t = useTranslations("language");
  const { locale, setLocale, syncLocaleToProfile } = useLanguageStore();
  const { user } = useAuthStore();

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    if (user) {
      syncLocaleToProfile(user.id, newLocale);
    }
  };

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
          onValueChange={(v) => handleLocaleChange(v as Locale)}
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
                className="flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors hover:bg-muted/50 has-[data-state=checked]:border-primary has-[data-state=checked]:bg-primary/5"
              >
                <RadioGroupItem value={lang.value} id={`lang-${lang.value}`} />
                <div className="flex-1">
                  <div className="font-semibold">{lang.label}</div>
                  <div className="text-muted-foreground text-sm">
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
