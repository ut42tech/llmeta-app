"use client";

import { useTranslations } from "next-intl";
import { WorldCard } from "@/components/WorldCard";
import { PLACEHOLDER_WORLDS } from "@/constants/worlds";

export default function DashboardPage() {
  const t = useTranslations("dashboard");

  return (
    <div className="p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground mt-2">{t("description")}</p>
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-4">{t("worlds")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {PLACEHOLDER_WORLDS.map((world) => (
            <WorldCard key={world.id} world={world} />
          ))}
        </div>
      </section>
    </div>
  );
}
