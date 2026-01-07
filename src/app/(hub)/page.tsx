"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { WorldCard } from "@/components/world";
import { createClient } from "@/lib/supabase/client";
import type { World } from "@/types/world";

type WorldWithInstanceCount = World & {
  instanceCount: number;
};

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const [worlds, setWorlds] = useState<WorldWithInstanceCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWorlds = async () => {
      const supabase = createClient();

      // Fetch worlds with instance count
      const { data: worldsData, error: worldsError } = await supabase
        .from("worlds")
        .select("*, instances(count)")
        .order("created_at", { ascending: false });

      if (worldsError) {
        console.error("Error fetching worlds:", worldsError);
        setIsLoading(false);
        return;
      }

      const worldsWithCount: WorldWithInstanceCount[] = (worldsData ?? []).map(
        (world) => ({
          ...world,
          instanceCount:
            (world.instances as unknown as { count: number }[])?.[0]?.count ??
            0,
        }),
      );

      setWorlds(worldsWithCount);
      setIsLoading(false);
    };

    fetchWorlds();
  }, []);

  return (
    <div className="p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="font-bold text-3xl tracking-tight">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("description")}</p>
      </header>

      <section>
        <h2 className="mb-4 font-semibold text-xl">{t("worlds")}</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading
            ? [1, 2, 3, 4].map((key) => (
                <Skeleton
                  key={`skeleton-${key}`}
                  className="aspect-square w-full rounded-xl"
                />
              ))
            : worlds.map((world) => (
                <WorldCard
                  key={world.id}
                  world={world}
                  instanceCount={world.instanceCount}
                />
              ))}
        </div>
      </section>
    </div>
  );
}
