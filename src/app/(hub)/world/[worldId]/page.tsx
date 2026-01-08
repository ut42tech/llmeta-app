"use client";

import { ArrowLeft, Calendar, Layers, Plus, Users } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { StatCard } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { InstanceCard } from "@/components/world";
import { createClient } from "@/lib/supabase/client";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";
import type { Instance, World } from "@/types/world";

export default function WorldDetailPage() {
  const params = useParams<{ worldId: string }>();
  const router = useRouter();
  const t = useTranslations("world");
  const format = useFormatter();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newInstanceName, setNewInstanceName] = useState("");
  const setInstanceId = useLocalPlayerStore((state) => state.setInstanceId);

  const [world, setWorld] = useState<World | null>(null);
  const [instances, setInstances] = useState<Instance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    const fetchWorldAndInstances = async () => {
      const supabase = createClient();

      // Fetch world
      const { data: worldData, error: worldError } = await supabase
        .from("worlds")
        .select("*")
        .eq("id", params.worldId)
        .single();

      if (worldError || !worldData) {
        setNotFoundState(true);
        setIsLoading(false);
        return;
      }

      setWorld(worldData);

      // Fetch instances
      const { data: instancesData, error: instancesError } = await supabase
        .from("instances")
        .select("*")
        .eq("world_id", params.worldId)
        .order("created_at", { ascending: false });

      if (instancesError) {
        console.error("Error fetching instances:", instancesError);
        setIsLoading(false);
        return;
      }

      // Fetch host profiles for instances with host_id
      const hostIds = (instancesData ?? [])
        .map((i) => i.host_id)
        .filter((id): id is string => id !== null);

      const hostProfiles: Record<string, string> = {};
      if (hostIds.length > 0) {
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, display_name")
          .in("id", hostIds);

        profilesData?.forEach((p) => {
          hostProfiles[p.id] = p.display_name;
        });
      }

      const instancesWithHostName: Instance[] = (instancesData ?? []).map(
        (instance) => ({
          ...instance,
          hostName: instance.host_id
            ? hostProfiles[instance.host_id]
            : undefined,
        }),
      );
      setInstances(instancesWithHostName);

      setIsLoading(false);
    };

    fetchWorldAndInstances();
  }, [params.worldId]);

  if (notFoundState) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="mx-4 w-full max-w-md">
          <CardHeader>
            <CardTitle>World Not Found</CardTitle>
            <CardDescription>
              This world does not exist or may have been deleted.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">
                <ArrowLeft className="mr-2 size-4" />
                {t("back")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCreateInstance = async () => {
    const instanceName = newInstanceName.trim() || `instance-${Date.now()}`;
    const supabase = createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Create instance in Supabase
    const { data: instance, error } = await supabase
      .from("instances")
      .insert({
        world_id: params.worldId,
        name: instanceName,
        host_id: user?.id ?? null,
        max_players: world?.player_capacity ?? 32,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating instance:", error);
      return;
    }

    setInstanceId(instance.id);
    setIsCreateDialogOpen(false);
    router.push(`/instance/${instance.id}`);
  };

  if (isLoading || !world) {
    return (
      <div className="min-h-screen p-6 lg:p-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-6 w-full" />
          <div className="grid grid-cols-3 gap-4 pt-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Back button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 size-4" />
              {t("back")}
            </Button>
          </Link>
        </div>

        {/* Header */}
        <header className="mb-8">
          <h1 className="font-bold text-3xl tracking-tight">{world.name}</h1>
          <p className="mt-2 text-muted-foreground">{world.description}</p>
        </header>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={Users}
            label={t("capacity")}
            value={world.player_capacity}
            largeValue
          />
          <StatCard
            icon={Layers}
            label={t("instances")}
            value={instances.length}
            largeValue
          />
          <StatCard
            icon={Calendar}
            label={t("createdAt")}
            value={format.dateTime(new Date(world.created_at), {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          />
        </div>

        {/* Instances Section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-xl">{t("instances")}</h2>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 size-4" />
                  {t("createInstance")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("createInstanceTitle")}</DialogTitle>
                  <DialogDescription>
                    {t("createInstanceDescription")}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="instanceName">{t("instanceName")}</Label>
                    <Input
                      id="instanceName"
                      value={newInstanceName}
                      onChange={(e) => setNewInstanceName(e.target.value)}
                      placeholder={t("instanceNamePlaceholder")}
                      maxLength={50}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    {t("cancel")}
                  </Button>
                  <Button onClick={handleCreateInstance}>{t("create")}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {instances.length > 0 ? (
            <div className="space-y-3">
              {instances.map((instance) => (
                <InstanceCard key={instance.id} instance={instance} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Layers className="mb-4 size-10 text-muted-foreground" />
                <p className="mb-1 font-medium">{t("noInstances")}</p>
                <p className="mb-4 text-muted-foreground text-sm">
                  {t("createFirstInstance")}
                </p>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  <Plus className="mr-2 size-4" />
                  {t("createInstance")}
                </Button>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}
