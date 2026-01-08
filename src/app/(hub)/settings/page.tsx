"use client";

import {
  CheckCircle2,
  Globe,
  Loader2,
  Mail,
  Settings,
  User,
  UserCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { AvatarPicker } from "@/components/hud/dock/AvatarPicker";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AVATAR_LIST } from "@/constants/avatars";
import { useAuth } from "@/hooks/auth";
import { type Locale, localeNames, locales } from "@/i18n/config";
import { useLanguageStore } from "@/stores/languageStore";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";
import type { ViverseAvatar } from "@/types/player";

export default function SettingsPage() {
  const t = useTranslations("settingsPage");
  const tLanguage = useTranslations("language");
  const { user, profile, updateProfile, signOut } = useAuth();
  const { locale, setLocale, syncLocaleToProfile } = useLanguageStore();
  const { currentAvatar, setCurrentAvatar } = useLocalPlayerStore();

  const [displayName, setDisplayName] = useState("");
  const [isAvatarUpdating, setIsAvatarUpdating] = useState(false);

  // Load avatar from profile on mount
  useEffect(() => {
    if (profile) {
      const savedAvatar = AVATAR_LIST.find((a) => a.id === profile.avatar_id);
      if (savedAvatar) {
        setCurrentAvatar(savedAvatar);
      }
    }
  }, [profile, setCurrentAvatar]);

  const handleAvatarSelect = async (avatar: ViverseAvatar) => {
    setCurrentAvatar(avatar);
    setIsAvatarUpdating(true);
    try {
      await updateProfile({ avatar_id: avatar.id });
    } finally {
      setIsAvatarUpdating(false);
    }
  };

  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (profile?.display_name) {
      setDisplayName(profile.display_name);
    }
  }, [profile]);

  const handleUpdateDisplayName = async () => {
    if (!displayName.trim() || displayName === profile?.display_name) return;

    setIsUpdating(true);
    try {
      await updateProfile({ display_name: displayName.trim() });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } finally {
      setIsUpdating(false);
    }
  };

  const hasChanges = displayName.trim() !== (profile?.display_name || "");

  return (
    <div className="max-w-2xl p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="flex items-center gap-2 font-bold text-3xl tracking-tight">
          <Settings className="size-8" />
          {t("title")}
        </h1>
        <p className="mt-2 text-muted-foreground">{t("description")}</p>
      </header>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5" />
              {t("accountInfo")}
            </CardTitle>
            <CardDescription>{t("accountInfoDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-full bg-muted font-medium text-2xl">
                {profile?.display_name?.charAt(0).toUpperCase() || "?"}
              </div>
              <div>
                <p className="font-medium">{profile?.display_name}</p>
                <p className="text-muted-foreground text-sm">{user?.email}</p>
              </div>
            </div>

            {/* Email (read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="size-4" />
                {t("email")}
              </Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-muted-foreground text-xs">{t("emailNote")}</p>
            </div>

            {/* Display Name (editable) */}
            <div className="space-y-2">
              <Label htmlFor="displayName" className="flex items-center gap-2">
                <User className="size-4" />
                {t("displayName")}
              </Label>
              <div className="flex gap-2">
                <Input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={t("displayNamePlaceholder")}
                  maxLength={30}
                  disabled={isUpdating}
                />
                <Button
                  onClick={handleUpdateDisplayName}
                  disabled={!hasChanges || isUpdating}
                >
                  {isUpdating ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : showSuccess ? (
                    <CheckCircle2 className="size-4 text-green-500" />
                  ) : (
                    t("update")
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="size-5" />
              {t("avatar")}
            </CardTitle>
            <CardDescription>{t("avatarDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <AvatarPicker
              avatars={AVATAR_LIST}
              selectedId={currentAvatar?.id}
              onSelect={handleAvatarSelect}
              disabled={isAvatarUpdating}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="size-5" />
              {t("language")}
            </CardTitle>
            <CardDescription>{t("languageDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="language">{tLanguage("selectLanguage")}</Label>
              <Select
                value={locale}
                onValueChange={(value) => {
                  const newLocale = value as Locale;
                  setLocale(newLocale);
                  if (user) {
                    syncLocaleToProfile(user.id, newLocale);
                  }
                }}
              >
                <SelectTrigger id="language" className="w-full max-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {locales.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {localeNames[loc as Locale]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">
              {t("dangerZone")}
            </CardTitle>
            <CardDescription>{t("dangerZoneDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={signOut}>
              {t("logout")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
