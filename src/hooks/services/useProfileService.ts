"use client";

import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import type { Locale } from "@/i18n/config";
import { promiseNotification } from "@/lib/notification-bus";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/authStore";
import { useLanguageStore } from "@/stores/languageStore";
import type { Tables } from "@/types/supabase";

type Profile = Tables<"profiles">;

export function useProfileService() {
  const t = useTranslations("settings");
  const supabase = createClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const { user, setProfile } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      setProfile: state.setProfile,
    })),
  );

  const { setLocale, syncLocaleToProfile } = useLanguageStore();

  const updateDisplayName = useCallback(
    async (displayName: string): Promise<Profile | null> => {
      if (!user) return null;
      setIsUpdating(true);

      try {
        const updatePromise = Promise.resolve(
          supabase
            .from("profiles")
            .update({
              display_name: displayName.trim(),
              updated_at: new Date().toISOString(),
            })
            .eq("id", user.id)
            .select()
            .single(),
        );

        const result = await promiseNotification(updatePromise, {
          loading: t("notifications.displayName.loading"),
          success: t("notifications.displayName.success"),
          error: t("notifications.displayName.error"),
        });

        if (result.error) return null;
        setProfile(result.data);
        return result.data;
      } finally {
        setIsUpdating(false);
      }
    },
    [supabase, user, setProfile, t],
  );

  const updateAvatar = useCallback(
    async (avatarId: number): Promise<Profile | null> => {
      if (!user) return null;
      setIsUpdating(true);

      try {
        const updatePromise = Promise.resolve(
          supabase
            .from("profiles")
            .update({
              avatar_id: avatarId,
              updated_at: new Date().toISOString(),
            })
            .eq("id", user.id)
            .select()
            .single(),
        );

        const result = await promiseNotification(updatePromise, {
          loading: t("notifications.avatar.loading"),
          success: t("notifications.avatar.success"),
          error: t("notifications.avatar.error"),
        });

        if (result.error) return null;
        setProfile(result.data);
        return result.data;
      } finally {
        setIsUpdating(false);
      }
    },
    [supabase, user, setProfile, t],
  );

  const updateLanguage = useCallback(
    async (locale: Locale): Promise<void> => {
      if (!user) return;

      setLocale(locale);
      await promiseNotification(syncLocaleToProfile(user.id, locale), {
        loading: t("notifications.language.loading"),
        success: t("notifications.language.success"),
        error: t("notifications.language.error"),
      });
    },
    [user, setLocale, syncLocaleToProfile, t],
  );

  return {
    updateDisplayName,
    updateAvatar,
    updateLanguage,
    isUpdating,
  };
}
