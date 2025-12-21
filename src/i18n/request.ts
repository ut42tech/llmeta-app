import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { defaultLocale, type Locale, locales } from "./config";

export default getRequestConfig(async () => {
  // Try to get locale from cookie first
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;

  // Then try Accept-Language header
  const headerStore = await headers();
  const acceptLanguage = headerStore.get("Accept-Language");

  let locale: Locale = defaultLocale;

  // Check cookie first
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    locale = cookieLocale as Locale;
  }
  // Then check Accept-Language header
  else if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(",")
      .map((lang) => lang.split(";")[0].trim().split("-")[0])
      .find((lang) => locales.includes(lang as Locale));

    if (preferredLocale) {
      locale = preferredLocale as Locale;
    }
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
    timeZone: "Asia/Tokyo",
  };
});
