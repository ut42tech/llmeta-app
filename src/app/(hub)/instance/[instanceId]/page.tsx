"use client";

import { ConnectionState as LiveKitConnectionState } from "livekit-client";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Globe,
  Loader2,
  RefreshCw,
  User,
  Users,
  WifiOff,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import {
  FadeIn,
  NotFoundCard,
  PageTransition,
  ScaleIn,
  SlideIn,
  StatCard,
} from "@/components/common";
import { LiveKitSyncProvider } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AVATAR_LIST } from "@/constants/avatars";
import { useAuth } from "@/hooks";
import { useSyncClient } from "@/hooks/livekit/useSyncClient";
import { createClient } from "@/lib/supabase/client";
import { useLocalPlayerStore, useWorldStore } from "@/stores";
import type { DbInstance, World } from "@/types";
import type { Tables } from "@/types/supabase";

const AvatarPreview = dynamic(
  () =>
    import("@/components/character/AvatarPreview").then(
      (mod) => mod.AvatarPreview,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-muted/50">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    ),
  },
);

type HostProfile = Pick<Tables<"profiles">, "id" | "display_name">;

interface InstanceWithDetails {
  instance: DbInstance;
  world: World | null;
  host: HostProfile | null;
}

function InstanceContent({
  instanceData,
  worldData,
  hostData,
}: {
  instanceData: DbInstance;
  worldData: World | null;
  hostData: HostProfile | null;
}) {
  const router = useRouter();
  const t = useTranslations("instanceLobby");
  const tInstance = useTranslations("instance");
  const tLobby = useTranslations("lobby");

  const { profile } = useAuth();

  const { connectionState } = useSyncClient();
  const connectionStatus = useWorldStore((state) => state.connection.status);
  const connectionError = useWorldStore((state) => state.connection.error);

  const {
    hasJoinedWorld,
    setUsername,
    setCurrentAvatar,
    setHasJoinedWorld,
    setInstanceId,
  } = useLocalPlayerStore();

  const [isReadyToEnter, setIsReadyToEnter] = useState(false);

  const userAvatar = profile?.avatar_id
    ? (AVATAR_LIST.find((a) => a.id === profile.avatar_id) ?? AVATAR_LIST[0])
    : AVATAR_LIST[0];

  useEffect(() => {
    setInstanceId(instanceData.id);
  }, [instanceData.id, setInstanceId]);

  const isConnected = connectionState === LiveKitConnectionState.Connected;
  const isFailed = connectionStatus === "failed";

  useEffect(() => {
    if (isReadyToEnter && isConnected && hasJoinedWorld) {
      router.push(`/experience/${instanceData.id}`);
    }
  }, [isReadyToEnter, isConnected, hasJoinedWorld, router, instanceData.id]);

  const handleJoinInstance = () => {
    setUsername(profile?.display_name ?? "Player");
    setCurrentAvatar(userAvatar);
    setHasJoinedWorld(true);
    setIsReadyToEnter(true);
  };

  const ConnectionIndicator = () => {
    if (isFailed) {
      return (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
          <WifiOff className="size-5 text-destructive" />
          <div className="flex-1">
            <p className="font-medium text-destructive text-sm">
              {tLobby("failed")}
            </p>
            {connectionError && (
              <p className="text-destructive/70 text-xs">{connectionError}</p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="mr-1 size-4" />
            {tLobby("retry")}
          </Button>
        </div>
      );
    }

    if (isConnected) {
      return (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
          <CheckCircle2 className="size-5 text-emerald-500" />
          <p className="font-medium text-emerald-500 text-sm">
            {tLobby("connected")}
          </p>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3 rounded-lg border bg-muted px-4 py-3">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground text-sm">{tLobby("connecting")}</p>
      </div>
    );
  };

  return (
    <PageTransition key={instanceData.id} className="h-[calc(100dvh-6rem)]">
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col">
        <FadeIn>
          <div className="mb-4 shrink-0">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 size-4" />
              {tInstance("back")}
            </Button>
          </div>
        </FadeIn>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-8 lg:grid-cols-2">
          <ScaleIn delay={0.1}>
            <div className="relative flex h-full items-center justify-center overflow-hidden rounded-2xl bg-linear-to-b from-muted/50 to-muted">
              <AvatarPreview
                vrmUrl={userAvatar.vrmUrl}
                className="h-full w-full"
              />
              <div className="absolute right-4 bottom-4 left-4">
                <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/95 px-4 py-3 shadow-md backdrop-blur-md">
                  {userAvatar.headIconUrl ? (
                    <div className="relative size-9 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
                      <Image
                        src={userAvatar.headIconUrl}
                        alt="Avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted ring-1 ring-border">
                      <User className="size-4 text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {profile?.display_name ?? "Player"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScaleIn>

          <div className="flex flex-col justify-center space-y-6">
            <SlideIn direction="right" delay={0.15}>
              <div>
                <p className="mb-1 text-muted-foreground text-sm">
                  {tInstance("instance")}
                </p>
                <h1 className="font-bold text-3xl tracking-tight">
                  {instanceData.name}
                </h1>
              </div>
            </SlideIn>

            <FadeIn delay={0.2}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard
                  icon={Globe}
                  label={t("world")}
                  value={
                    worldData ? (
                      <Link
                        href={`/world/${worldData.id}`}
                        className="transition-colors hover:text-primary"
                      >
                        {worldData.name}
                      </Link>
                    ) : (
                      "-"
                    )
                  }
                />
                <StatCard
                  icon={User}
                  label={t("host")}
                  value={hostData?.display_name ?? "-"}
                />
                <StatCard
                  icon={Users}
                  label={t("capacity")}
                  value={instanceData.max_players}
                  largeValue
                />
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <ConnectionIndicator />
            </FadeIn>

            <FadeIn delay={0.35}>
              <div className="flex items-start gap-3 rounded-lg border border-amber-500/50 bg-amber-500/10 p-4">
                <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-500" />
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-amber-500 text-sm">
                    {t("privacyTitle")}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {t("privacyText")}
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <Button
                type="button"
                onClick={handleJoinInstance}
                disabled={isReadyToEnter}
                className="w-full"
                size="lg"
              >
                {isReadyToEnter ? (
                  <>
                    <Loader2 className="mr-2 size-5 animate-spin" />
                    {tLobby("waitingForConnection")}
                  </>
                ) : (
                  <>
                    {t("joinButton")}
                    <ArrowRight className="ml-2 size-5" />
                  </>
                )}
              </Button>
            </FadeIn>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

function InstancePage() {
  const params = useParams<{ instanceId: string }>();
  const tInstance = useTranslations("instance");
  const [instanceDetails, setInstanceDetails] =
    useState<InstanceWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchInstanceWithDetails = async () => {
      if (!params.instanceId) return;

      const supabase = createClient();

      const { data: instanceData, error: instanceError } = await supabase
        .from("instances")
        .select("*")
        .eq("id", params.instanceId)
        .single();

      if (instanceError || !instanceData) {
        console.error("Error fetching instance:", instanceError);
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      let worldData: World | null = null;
      if (instanceData.world_id) {
        const { data } = await supabase
          .from("worlds")
          .select("*")
          .eq("id", instanceData.world_id)
          .single();
        worldData = data;
      }

      let hostData: HostProfile | null = null;
      if (instanceData.host_id) {
        const { data } = await supabase
          .from("profiles")
          .select("id, display_name")
          .eq("id", instanceData.host_id)
          .single();
        hostData = data;
      }

      setInstanceDetails({
        instance: instanceData,
        world: worldData,
        host: hostData,
      });
      setIsLoading(false);
    };

    fetchInstanceWithDetails();
  }, [params.instanceId]);

  if (isLoading) {
    return (
      <div className="h-[calc(100dvh-6rem)]">
        <div className="mx-auto h-full w-full max-w-6xl">
          <div className="mb-4">
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="grid h-[calc(100%-4rem)] grid-cols-1 gap-8 lg:grid-cols-2">
            <Skeleton className="h-full rounded-2xl" />
            <div className="flex flex-col justify-center space-y-6">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-48" />
              <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !instanceDetails) {
    return (
      <NotFoundCard
        title={tInstance("notFound.title")}
        description={tInstance("notFound.description")}
        backLabel={tInstance("notFound.backToHome")}
        containerClassName="flex h-[calc(100dvh-6rem)] items-center justify-center"
      />
    );
  }

  return (
    <LiveKitSyncProvider instanceId={instanceDetails.instance.id}>
      <InstanceContent
        key={instanceDetails.instance.id}
        instanceData={instanceDetails.instance}
        worldData={instanceDetails.world}
        hostData={instanceDetails.host}
      />
    </LiveKitSyncProvider>
  );
}

export default InstancePage;
