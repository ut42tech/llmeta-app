import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultLocale, type Locale, locales } from "@/i18n/config";

type LanguageState = {
  locale: Locale;
};

type LanguageActions = {
  setLocale: (locale: Locale) => void;
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
 * Language store for managing the current locale.
 * Persisted to localStorage so the user's preference is remembered.
 */
export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      locale: defaultLocale,
      setLocale: (locale) => {
        if (locales.includes(locale)) {
          set({ locale });
          // Set cookie for server-side detection
          setCookie("NEXT_LOCALE", locale, 31536000);
        }
      },
    }),
    {
      name: "language-storage",
    },
  ),
);
