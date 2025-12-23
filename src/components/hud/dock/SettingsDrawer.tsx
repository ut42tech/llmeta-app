"use client";

import { Globe, Mouse, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Euler, Vector3 } from "three";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AVATAR_LIST } from "@/constants/avatars";
import { useSyncClient } from "@/hooks/livekit/useSyncClient";
import { type Locale, localeNames, locales } from "@/i18n/config";
import { useLanguageStore } from "@/stores/languageStore";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";
import type { ViverseAvatar } from "@/types/player";

type SettingsSectionProps = {
  title: string;
  children: React.ReactNode;
};

const SettingsSection = ({ title, children }: SettingsSectionProps) => (
  <div className="space-y-3">
    <h3 className="text-sm font-semibold">{title}</h3>
    {children}
  </div>
);

type SettingsRowProps = {
  label: string;
  description?: string;
  children: React.ReactNode;
};

const SettingsRow = ({ label, description, children }: SettingsRowProps) => (
  <div className="flex items-center justify-between py-3 border rounded-md px-3">
    <div className="space-y-1">
      <div className="text-sm text-muted-foreground">{label}</div>
      {description && (
        <div className="text-xs text-muted-foreground">{description}</div>
      )}
    </div>
    {children}
  </div>
);

type InfoRowProps = {
  label: string;
  value: string;
  mono?: boolean;
};

const InfoRow = ({ label, value, mono }: InfoRowProps) => (
  <div className="flex items-center justify-between py-3 border-b border-border">
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
  </div>
);

const GeneralTab = () => {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const { sendProfile } = useSyncClient();

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

  const handleResetPosition = () => {
    teleport(new Vector3(0, 0, 0), new Euler(0, 0, 0));
  };

  const handleSelectAvatar = (avatar: ViverseAvatar) => {
    const currentPosition = position.clone();
    const currentRotation = rotation.clone();
    setCurrentAvatar(avatar);
    teleport(currentPosition, currentRotation);
    sendProfile({ avatar });
  };

  return (
    <div className="space-y-6">
      <SettingsSection title={t("username")}>
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

      <SettingsSection title={t("avatar")}>
        <AvatarPicker
          avatars={AVATAR_LIST}
          selectedId={currentAvatar?.id}
          onSelect={handleSelectAvatar}
        />
      </SettingsSection>

      <SettingsSection title={t("position")}>
        <SettingsRow
          label={`x: ${position.x.toFixed(2)} / y: ${position.y.toFixed(2)} / z: ${position.z.toFixed(2)}`}
        >
          <Button variant="outline" onClick={handleResetPosition}>
            {tCommon("reset")}
          </Button>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title={t("sessionId")}>
        <InfoRow label={t("sessionId")} value={sessionId} mono />
      </SettingsSection>
    </div>
  );
};

const ControlsTab = () => {
  const t = useTranslations("worldInfo");

  return (
    <div className="space-y-6">
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
  );
};

const LanguageTab = () => {
  const t = useTranslations("language");
  const { locale, setLocale } = useLanguageStore();

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">{t("selectLanguage")}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Globe className="size-4" />
                {localeNames[locale as Locale]}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-full">
            {locales.map((loc) => (
              <DropdownMenuItem
                key={loc}
                onClick={() => setLocale(loc)}
                className={locale === loc ? "bg-accent" : ""}
              >
                {localeNames[loc as Locale]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

const SettingsContent = () => {
  const t = useTranslations("settings");

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="general">{t("tabs.general")}</TabsTrigger>
        <TabsTrigger value="controls">{t("tabs.controls")}</TabsTrigger>
        <TabsTrigger value="language">{t("tabs.language")}</TabsTrigger>
      </TabsList>
      <TabsContent value="general" className="mt-4">
        <GeneralTab />
      </TabsContent>
      <TabsContent value="controls" className="mt-4">
        <ControlsTab />
      </TabsContent>
      <TabsContent value="language" className="mt-4">
        <LanguageTab />
      </TabsContent>
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
          <DrawerHeader className="text-left shrink-0">
            <DrawerTitle className="text-2xl font-bold">
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
