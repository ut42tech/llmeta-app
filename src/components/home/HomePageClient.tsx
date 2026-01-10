"use client";

import { Home } from "lucide-react";
import { useTranslations } from "next-intl";
import { FadeIn, PageTransition } from "@/components/common";
import { WorldCard } from "@/components/world";
import type { WorldWithInstanceCount } from "@/types";

type HomePageClientProps = {
  worlds: WorldWithInstanceCount[];
};

export function HomePageClient({ worlds }: HomePageClientProps) {
  const t = useTranslations("home");

  return (
    <PageTransition className="p-6 lg:p-8">
      <FadeIn delay={0} duration={0.6}>
        <header className="mb-8">
          <h1 className="flex items-center gap-2 font-bold text-3xl tracking-tight">
            <Home className="size-8" />
            {t("title")}
          </h1>
          <p className="mt-2 text-muted-foreground">{t("description")}</p>
        </header>
      </FadeIn>

      <section>
        <FadeIn delay={0.1} duration={0.5}>
          <h2 className="mb-4 font-semibold text-xl">{t("worlds")}</h2>
        </FadeIn>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {worlds.map((world) => (
            <WorldCard
              key={world.id}
              world={world}
              instanceCount={world.instanceCount}
            />
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
