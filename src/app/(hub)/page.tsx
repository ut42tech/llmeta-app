"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { WorldCard } from "@/components/world";
import { createClient } from "@/lib/supabase/client";
import type { World } from "@/types/world";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const [worlds, setWorlds] = useState<World[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWorlds = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("worlds")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching worlds:", error);
      } else {
        setWorlds(data ?? []);
      }
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
                <div key={`skeleton-${key}`} className="space-y-3">
                  <Skeleton className="aspect-video w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            : worlds.map((world) => <WorldCard key={world.id} world={world} />)}
        </div>
      </section>
    </div>
  );
}
