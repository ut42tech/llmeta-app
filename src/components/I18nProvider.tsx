"use client";

import { type AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useLanguageStore } from "@/stores/languageStore";

type I18nProviderProps = {
  messages: AbstractIntlMessages;
  locale: string;
  children: ReactNode;
};

export function I18nProvider({
  messages: initialMessages,
  locale: initialLocale,
  children,
}: I18nProviderProps) {
  const storedLocale = useLanguageStore((state) => state.locale);
  const [messages, setMessages] =
    useState<AbstractIntlMessages>(initialMessages);
  const [locale, setLocale] = useState(initialLocale);

  useEffect(() => {
    // Load messages for the stored locale if different from initial
    if (storedLocale && storedLocale !== locale) {
      import(`@/i18n/messages/${storedLocale}.json`)
        .then((module) => {
          setMessages(module.default);
          setLocale(storedLocale);
        })
        .catch(console.error);
    }
  }, [storedLocale, locale]);

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      {children}
    </NextIntlClientProvider>
  );
}
