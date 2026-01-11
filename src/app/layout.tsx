import type { Metadata } from "next";
import { Noto_Sans_JP, Roboto, Roboto_Mono } from "next/font/google";
import { getLocale, getMessages, getTimeZone } from "next-intl/server";
import { I18nProvider } from "@/components/providers";
import { NotificationProvider } from "@/components/providers/NotificationProvider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const notoSans = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LLMeta",
  description: "Beyond limits, with AI",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const timeZone = await getTimeZone();

  return (
    <html lang={locale}>
      <body
        className={`${notoSans.variable} ${roboto.variable} ${robotoMono.variable} antialiased`}
      >
        <I18nProvider messages={messages} locale={locale} timeZone={timeZone}>
          <NotificationProvider>
            <Toaster richColors position="top-right" />
            {children}
          </NotificationProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
