"use client";

import { ConnectionState as LiveKitConnectionState } from "livekit-client";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  RefreshCw,
  WifiOff,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { AvatarPicker } from "@/components/hud/dock/AvatarPicker";
import { LiveKitSyncProvider } from "@/components/providers";
import { BackgroundCanvas } from "@/components/scene";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AVATAR_LIST } from "@/constants/avatars";
import { useAuth } from "@/hooks/auth";
import { useSyncClient } from "@/hooks/livekit/useSyncClient";
import { createClient } from "@/lib/supabase/client";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";
import { useWorldStore } from "@/stores/worldStore";
import type { ViverseAvatar } from "@/types/player";
import type { DbInstance } from "@/types/world";

function InstanceContent({ instanceData }: { instanceData: DbInstance }) {
  const router = useRouter();
  const t = useTranslations("joinWorld");
  const tInstance = useTranslations("instance");
  const tLobby = useTranslations("lobby");

  const { profile, updateProfile } = useAuth();

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

  const [inputUsername, setInputUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<ViverseAvatar | null>(
    null,
  );
  const [isReadyToEnter, setIsReadyToEnter] = useState(false);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  // Set instance ID in store on mount
  useEffect(() => {
    setInstanceId(instanceData.id);
  }, [instanceData.id, setInstanceId]);

  // Load profile data when available
  useEffect(() => {
    if (profile && !isProfileLoaded) {
      setInputUsername(profile.display_name || "");
      if (profile.avatar_id) {
        const savedAvatar = AVATAR_LIST.find((a) => a.id === profile.avatar_id);
        if (savedAvatar) {
          setSelectedAvatar(savedAvatar);
        }
      }
      setIsProfileLoaded(true);
    }
  }, [profile, isProfileLoaded]);

  const isConnected = connectionState === LiveKitConnectionState.Connected;
  const isFailed = connectionStatus === "failed";

  // Navigate to experience when ready and connected
  useEffect(() => {
    if (isReadyToEnter && isConnected && hasJoinedWorld) {
      router.push("/experience");
    }
  }, [isReadyToEnter, isConnected, hasJoinedWorld, router]);

  const isFormValid =
    inputUsername.trim().length > 0 && selectedAvatar !== null;

  const handleJoinWorld = async () => {
    if (!isFormValid) return;

    // Save profile to Supabase
    await updateProfile({
      display_name: inputUsername.trim(),
      avatar_id: selectedAvatar?.id ?? null,
    });

    setUsername(inputUsername.trim());
    if (selectedAvatar) {
      setCurrentAvatar(selectedAvatar);
    }
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

    // Default: connecting or waiting
    return (
      <div className="flex items-center gap-3 rounded-lg border bg-muted px-4 py-3">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground text-sm">{tLobby("connecting")}</p>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <BackgroundCanvas />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-white/70 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="mr-2 size-4" />
            {tInstance("back")}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/70">
            {tInstance("instance")}:{" "}
            <span className="font-medium text-white">{instanceData.name}</span>
          </span>
        </div>
      </header>

      <main className="relative z-10 flex min-h-[calc(100vh-120px)] items-center justify-center px-6 py-8 md:px-12">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl">{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ConnectionIndicator />

            <div className="space-y-2">
              <Label htmlFor="username">{t("usernameLabel")}</Label>
              <Input
                id="username"
                type="text"
                placeholder={t("usernamePlaceholder")}
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                maxLength={20}
                disabled={isReadyToEnter}
              />
            </div>

            <div className="space-y-2">
              <Label>{t("avatarLabel")}</Label>
              <div className="rounded-lg border bg-muted/50 p-4">
                <AvatarPicker
                  avatars={AVATAR_LIST}
                  selectedId={selectedAvatar?.id}
                  onSelect={setSelectedAvatar}
                  disabled={isReadyToEnter}
                />
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-amber-500/50 bg-amber-500/10 p-4">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-500" />
              <div className="flex flex-col gap-1">
                <p className="font-medium text-amber-500 text-sm">
                  {t("warningTitle")}
                </p>
                <p className="text-muted-foreground text-sm">
                  {t("warningText")}
                </p>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleJoinWorld}
              disabled={!isFormValid || isReadyToEnter}
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
                  {t("continueButton")}
                  <ArrowRight className="ml-2 size-5" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function InstancePage() {
  const params = useParams<{ instanceId: string }>();
  const tInstance = useTranslations("instance");
  const [instance, setInstance] = useState<DbInstance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchInstance = async () => {
      if (!params.instanceId) return;

      const supabase = createClient();
      const { data, error } = await supabase
        .from("instances")
        .select("*")
        .eq("id", params.instanceId)
        .single();

      if (error || !data) {
        console.error("Error fetching instance:", error);
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      setInstance(data);
      setIsLoading(false);
    };

    fetchInstance();
  }, [params.instanceId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loader2 className="size-8 animate-spin text-white" />
      </div>
    );
  }

  if (notFound || !instance) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Card className="mx-4 w-full max-w-md">
          <CardHeader>
            <CardTitle>{tInstance("notFound.title")}</CardTitle>
            <CardDescription>
              {tInstance("notFound.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/">
                <ArrowLeft className="mr-2 size-4" />
                {tInstance("notFound.backToHome")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <LiveKitSyncProvider instanceId={instance.id}>
      <InstanceContent instanceData={instance} />
    </LiveKitSyncProvider>
  );
}

export default InstancePage;
