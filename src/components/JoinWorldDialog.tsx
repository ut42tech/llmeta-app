"use client";

import { AlertTriangle, Globe } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AvatarPicker } from "@/components/hud/dock/AvatarPicker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AVATAR_LIST } from "@/constants/avatars";
import { type Locale, localeNames, locales } from "@/i18n/config";
import { useLanguageStore } from "@/stores/languageStore";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";
import type { ViverseAvatar } from "@/types/player";

export const JoinWorldDialog = () => {
  const t = useTranslations("joinWorld");
  const hasJoinedWorld = useLocalPlayerStore((state) => state.hasJoinedWorld);
  const setUsername = useLocalPlayerStore((state) => state.setUsername);
  const setCurrentAvatar = useLocalPlayerStore(
    (state) => state.setCurrentAvatar,
  );
  const setHasJoinedWorld = useLocalPlayerStore(
    (state) => state.setHasJoinedWorld,
  );
  const { locale, setLocale } = useLanguageStore();

  const [inputUsername, setInputUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<ViverseAvatar | null>(
    null,
  );

  const open = !hasJoinedWorld;

  const isFormValid =
    inputUsername.trim().length > 0 && selectedAvatar !== null;

  const handleJoinWorld = () => {
    if (!isFormValid) return;

    setUsername(inputUsername.trim());
    if (selectedAvatar) {
      setCurrentAvatar(selectedAvatar);
    }

    setHasJoinedWorld(true);
  };

  const handleAvatarSelect = (avatar: ViverseAvatar) => {
    setSelectedAvatar(avatar);
  };

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[90vh] flex flex-col"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="size-5" />
            {t("title")}
          </DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="flex flex-col gap-6 py-2">
            <div className="flex flex-col gap-2">
              <Label>{t("languageLabel")}</Label>
              <ToggleGroup
                type="single"
                value={locale}
                onValueChange={(value) => value && setLocale(value as Locale)}
                variant="outline"
              >
                {locales.map((loc) => (
                  <ToggleGroupItem
                    key={loc}
                    value={loc}
                    aria-label={localeNames[loc]}
                  >
                    {localeNames[loc]}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                {t("usernameLabel")}
              </Label>
              <Input
                id="username"
                type="text"
                placeholder={t("usernamePlaceholder")}
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                maxLength={20}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>{t("avatarLabel")}</Label>
              <AvatarPicker
                avatars={AVATAR_LIST}
                selectedId={selectedAvatar?.id}
                onSelect={handleAvatarSelect}
              />
            </div>

            <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="size-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-amber-500">
                    {t("warningTitle")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("warningText")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="mt-4">
          <Button
            type="button"
            onClick={handleJoinWorld}
            disabled={!isFormValid}
          >
            {t("continueButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
