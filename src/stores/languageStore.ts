import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultLocale, type Locale, locales } from "@/i18n/config";
import { createClient } from "@/lib/supabase/client";

type LanguageState = {
  locale: Locale;
};

type LanguageActions = {
  setLocale: (locale: Locale) => void;
  syncLocaleToProfile: (userId: string, locale: Locale) => Promise<void>;
  initializeFromProfile: (lang: string | null) => void;
};

type LanguageStore = LanguageState & LanguageActions;

/**
 * Set a cookie value safely
 */
const setCookie = (name: string, value: string, maxAge: number) => {
  const cookieValue = `${name}=${value};path=/;max-age=${maxAge}`;
  // biome-ignore lint/suspicious/noDocumentCookie: Required for setting locale cookie
  document.cookie = cookieValue;
};

/**
 * Validate if a string is a valid locale
 */
const isValidLocale = (lang: string | null): lang is Locale => {
  return lang !== null && locales.includes(lang as Locale);
};

/**
 * Language store for managing the current locale.
 * Persisted to localStorage so the user's preference is remembered.
 * Can sync with Supabase profile for cross-device consistency.
 */
export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      locale: defaultLocale,
      setLocale: (locale) => {
        if (locales.includes(locale)) {
          set({ locale });
          setCookie("NEXT_LOCALE", locale, 31536000);
        }
      },
      syncLocaleToProfile: async (userId: string, locale: Locale) => {
        const supabase = createClient();
        await supabase
          .from("profiles")
          .update({ lang: locale })
          .eq("id", userId);
      },
      initializeFromProfile: (lang: string | null) => {
        if (isValidLocale(lang)) {
          set({ locale: lang });
          setCookie("NEXT_LOCALE", lang, 31536000);
        }
      },
    }),
    {
      name: "language-storage",
    },
  ),
);
