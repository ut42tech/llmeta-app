"use client";

import { useStartAudio } from "@livekit/components-react";
import { AlertTriangle, Globe } from "lucide-react";
import { useState } from "react";
import { AvatarPicker } from "@/components/overlay/dock/AvatarPicker";
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
import { useLocalPlayerStore } from "@/stores/localPlayerStore";
import type { ViverseAvatar } from "@/types";

type Language = "en" | "ja";

const translations = {
  en: {
    title: "Join World",
    description:
      "Set up your profile to join the world. Audio permission is required to hear other users.",
    languageLabel: "Language",
    warningTitle: "Privacy Notice",
    warningText:
      "This app sends data to external services. Please do not share personal or sensitive information.",
    usernameLabel: "Username",
    usernamePlaceholder: "Enter your username",
    avatarLabel: "Choose your avatar",
    continueButton: "Continue",
  },
  ja: {
    title: "ワールドに参加",
    description:
      "ワールドに参加するためにプロフィールを設定してください。他のユーザーの音声を聞くにはオーディオ権限が必要です。",
    languageLabel: "言語",
    warningTitle: "プライバシーに関するお知らせ",
    warningText:
      "このアプリは外部サービスに情報を送信します。個人情報などの機密情報は送信しないでください。",
    usernameLabel: "ユーザーネーム",
    usernamePlaceholder: "ユーザーネームを入力",
    avatarLabel: "アバターを選択",
    continueButton: "続ける",
  },
};

export const JoinWorldDialog = () => {
  const { mergedProps, canPlayAudio } = useStartAudio({
    props: {},
  });

  const setUsername = useLocalPlayerStore((state) => state.setUsername);
  const setCurrentAvatar = useLocalPlayerStore(
    (state) => state.setCurrentAvatar,
  );

  const [language, setLanguage] = useState<Language>("en");
  const [inputUsername, setInputUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<ViverseAvatar | null>(
    null,
  );

  const t = translations[language];
  const open = !canPlayAudio;

  const isFormValid =
    inputUsername.trim().length > 0 && selectedAvatar !== null;

  const handleEnableAudio = () => {
    if (!isFormValid) return;

    // Save to store
    setUsername(inputUsername.trim());
    if (selectedAvatar) {
      setCurrentAvatar(selectedAvatar);
    }

    // Enable audio
    mergedProps.onClick?.();
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
            {t.title}
          </DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="flex flex-col gap-6 py-2">
            {/* Language Selection */}
            <div className="flex flex-col gap-2">
              <Label>{t.languageLabel}</Label>
              <ToggleGroup
                type="single"
                value={language}
                onValueChange={(value) =>
                  value && setLanguage(value as Language)
                }
                variant="outline"
              >
                <ToggleGroupItem value="en" aria-label="English">
                  English
                </ToggleGroupItem>
                <ToggleGroupItem value="ja" aria-label="日本語">
                  日本語
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Username Input */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                {t.usernameLabel}
              </Label>
              <Input
                id="username"
                type="text"
                placeholder={t.usernamePlaceholder}
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                maxLength={20}
              />
            </div>

            {/* Avatar Selection */}
            <div className="flex flex-col gap-2">
              <Label>{t.avatarLabel}</Label>
              <AvatarPicker
                avatars={AVATAR_LIST}
                selectedId={selectedAvatar?.id}
                onSelect={handleAvatarSelect}
              />
            </div>

            {/* Privacy Warning */}
            <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="size-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-amber-500">
                    {t.warningTitle}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t.warningText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="mt-4">
          <Button
            type="button"
            onClick={handleEnableAudio}
            disabled={!isFormValid}
          >
            {t.continueButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
