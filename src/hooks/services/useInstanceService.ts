"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { promiseNotification } from "@/lib/notification-bus";
import { createClient } from "@/lib/supabase/client";

type CreateInstanceResult = {
  id: string;
  name: string;
  world_id: string;
} | null;

export function useInstanceService() {
  const t = useTranslations("world");
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const createInstance = useCallback(
    async (
      worldId: string,
      name: string,
      options?: { maxPlayers?: number; navigateOnSuccess?: boolean },
    ): Promise<CreateInstanceResult> => {
      setIsCreating(true);

      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const insertPromise = Promise.resolve(
          supabase
            .from("instances")
            .insert({
              world_id: worldId,
              name: name.trim() || `instance-${Date.now()}`,
              host_id: user?.id ?? null,
              max_players: options?.maxPlayers ?? 32,
            })
            .select()
            .single(),
        );

        const result = await promiseNotification(insertPromise, {
          loading: t("creating") ?? "Creating...",
          success: t("createInstanceSuccess"),
          error: t("createInstanceError"),
        });

        if (result.error) {
          console.error("Error creating instance:", result.error);
          return null;
        }

        if (options?.navigateOnSuccess !== false && result.data) {
          router.push(`/instance/${result.data.id}`);
        }

        return result.data;
      } finally {
        setIsCreating(false);
      }
    },
    [t, router],
  );

  return { createInstance, isCreating };
}
