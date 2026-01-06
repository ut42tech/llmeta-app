"use client";

import { ArrowLeft, Globe, Plus, Users } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
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
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle>World Not Found</CardTitle>
            <CardDescription>
              This world does not exist or may have been deleted.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">
                <ArrowLeft className="size-4 mr-2" />
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
      <div className="min-h-screen">
        <Skeleton className="h-64 md:h-80 w-full" />
        <div className="p-6 lg:p-8 max-w-4xl space-y-8">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 bg-muted overflow-hidden flex items-center justify-center">
        <Globe className="size-32 text-muted-foreground/30" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent" />

        <div className="absolute top-4 left-4">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="bg-background/50 backdrop-blur"
            >
              <ArrowLeft className="size-4 mr-2" />
              {t("back")}
            </Button>
          </Link>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold">{world.name}</h1>
            <p className="text-muted-foreground mt-2">{world.description}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 lg:p-8 max-w-4xl">
        {/* World Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="size-5" />
              {t("worldInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">{t("capacity")}</p>
                <p className="font-medium flex items-center gap-1">
                  <Users className="size-4" />
                  {world.player_capacity} {t("players")}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">{t("createdAt")}</p>
                <p className="font-medium">
                  {format.dateTime(new Date(world.created_at), {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instances Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{t("instances")}</h2>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="size-4 mr-2" />
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
            <Card>
              <CardContent className="py-12 text-center">
                <CardDescription>{t("noInstances")}</CardDescription>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}
