"use client";

import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/common";
import { BackgroundCanvas } from "@/components/scene";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("common");

  return (
    <div className="relative min-h-dvh">
      <BackgroundCanvas />

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4">
        {/* App Logo & Name */}
        <div className="flex items-center gap-2">
          <Sparkles className="size-6 text-primary" />
          <span className="font-bold text-xl">{t("appName")}</span>
        </div>

        {/* Language Switcher */}
        <LanguageSwitcher />
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex min-h-dvh items-center justify-center p-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 z-10 p-4 text-center">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} {t("copyright")}
        </p>
      </footer>
    </div>
  );
}
