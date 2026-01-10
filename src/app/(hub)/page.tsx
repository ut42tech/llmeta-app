import { HomePageClient } from "@/components/home";
import { createClient } from "@/lib/supabase/server";
import type { WorldWithInstanceCount } from "@/types";

async function fetchWorlds(): Promise<WorldWithInstanceCount[]> {
  const supabase = await createClient();

  const { data: worldsData, error: worldsError } = await supabase
    .from("worlds")
    .select("*, instances(count)")
    .order("created_at", { ascending: false });

  if (worldsError) {
    console.error("Error fetching worlds:", worldsError);
    return [];
  }

  return (worldsData ?? []).map((world) => ({
    ...world,
    instanceCount:
      (world.instances as unknown as { count: number }[])?.[0]?.count ?? 0,
  }));
}

export default async function HomePage() {
  const worlds = await fetchWorlds();

  return <HomePageClient worlds={worlds} />;
}
