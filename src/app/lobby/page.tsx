"use client";

import { ConnectionState as LiveKitConnectionState } from "livekit-client";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  LogOut,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { BackgroundCanvas } from "@/components/BackgroundCanvas";
import { AvatarPicker } from "@/components/hud/dock/AvatarPicker";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LiveKitSyncProvider } from "@/components/LiveKitSyncProvider";
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
import { useSyncClient } from "@/hooks/livekit/useSyncClient";
import { useAuth } from "@/hooks/useAuth";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";
import { useWorldStore } from "@/stores/worldStore";
import type { ViverseAvatar } from "@/types/player";

function LobbyContent() {
  const router = useRouter();
  const t = useTranslations("joinWorld");
  const tLobby = useTranslations("lobby");
  const tAuth = useTranslations("auth");

  const {
    profile,
    isLoading: isAuthLoading,
    updateProfile,
    signOut,
  } = useAuth();

  const { connectionState } = useSyncClient();
  const connectionStatus = useWorldStore((state) => state.connection.status);
  const connectionError = useWorldStore((state) => state.connection.error);

  const hasJoinedWorld = useLocalPlayerStore((state) => state.hasJoinedWorld);
  const setUsername = useLocalPlayerStore((state) => state.setUsername);
  const setCurrentAvatar = useLocalPlayerStore(
    (state) => state.setCurrentAvatar,
  );
  const setHasJoinedWorld = useLocalPlayerStore(
    (state) => state.setHasJoinedWorld,
  );

  const [inputUsername, setInputUsername] = useState("");
  const [inputRoomName, setInputRoomName] = useState(
    useLocalPlayerStore.getState().roomName,
  );
  const [selectedAvatar, setSelectedAvatar] = useState<ViverseAvatar | null>(
    null,
  );
  const [isReadyToEnter, setIsReadyToEnter] = useState(false);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const setRoomName = useLocalPlayerStore((state) => state.setRoomName);

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
  const isConnecting =
    connectionState === LiveKitConnectionState.Connecting ||
    connectionStatus === "connecting";
  const isFailed = connectionStatus === "failed";

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
    setRoomName(
      inputRoomName.trim() || useLocalPlayerStore.getState().roomName,
    );
    if (selectedAvatar) {
      setCurrentAvatar(selectedAvatar);
    }
    setHasJoinedWorld(true);
    setIsReadyToEnter(true);
  };

  useEffect(() => {
    if (isReadyToEnter && isConnected && hasJoinedWorld) {
      router.push("/experience");
    }
  }, [isReadyToEnter, isConnected, hasJoinedWorld, router]);

  const handleRetry = () => {
    window.location.reload();
  };

  const handleAvatarSelect = (avatar: ViverseAvatar) => {
    setSelectedAvatar(avatar);
  };

  const ConnectionIndicator = () => {
    if (isFailed) {
      return (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/30">
          <WifiOff className="size-5 text-destructive" />
          <div className="flex-1">
            <p className="text-sm font-medium text-destructive">
              {tLobby("failed")}
            </p>
            {connectionError && (
              <p className="text-xs text-destructive/70">{connectionError}</p>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={handleRetry}>
            <RefreshCw className="size-4 mr-1" />
            {tLobby("retry")}
          </Button>
        </div>
      );
    }

    if (isConnected) {
      return (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
          <CheckCircle2 className="size-5 text-emerald-500" />
          <p className="text-sm font-medium text-emerald-500">
            {tLobby("connected")}
          </p>
        </div>
      );
    }

    if (isConnecting) {
      return (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted border">
          <Loader2 className="size-5 text-muted-foreground animate-spin" />
          <p className="text-sm text-muted-foreground">
            {tLobby("connecting")}
          </p>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted border">
        <Wifi className="size-5 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {tLobby("waitingForConnection")}
        </p>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <BackgroundCanvas />

      {isAuthLoading ? (
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <Loader2 className="size-8 text-white animate-spin" />
        </div>
      ) : (
        <>
          <header className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-white/90" />
              <span className="text-sm text-white/90">PROJECT LLMeta</span>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <LogOut className="size-4 mr-2" />
                {tAuth("logout")}
              </Button>
            </div>
          </header>

          <main className="relative z-10 flex items-center justify-center px-6 md:px-12 py-8 min-h-[calc(100vh-120px)]">
            <Card className="w-full max-w-lg">
              <CardHeader>
                <CardTitle className="text-2xl">{t("title")}</CardTitle>
                <CardDescription>{t("description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ConnectionIndicator />

                <div className="space-y-2">
                  <Label htmlFor="roomName">{t("roomNameLabel")}</Label>
                  <Input
                    id="roomName"
                    type="text"
                    placeholder={t("roomNamePlaceholder")}
                    value={inputRoomName}
                    onChange={(e) => setInputRoomName(e.target.value)}
                    maxLength={50}
                    disabled={isReadyToEnter}
                  />
                </div>

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
                  <div className="p-4 rounded-lg border bg-muted/50">
                    <AvatarPicker
                      avatars={AVATAR_LIST}
                      selectedId={selectedAvatar?.id}
                      onSelect={handleAvatarSelect}
                      disabled={isReadyToEnter}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg border border-amber-500/50 bg-amber-500/10">
                  <AlertTriangle className="size-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-amber-500">
                      {t("warningTitle")}
                    </p>
                    <p className="text-sm text-muted-foreground">
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
                      <Loader2 className="size-5 mr-2 animate-spin" />
                      {tLobby("waitingForConnection")}
                    </>
                  ) : (
                    <>
                      {t("continueButton")}
                      <ArrowRight className="size-5 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </main>
        </>
      )}
    </div>
  );
}

export default function LobbyPage() {
  return (
    <LiveKitSyncProvider>
      <LobbyContent />
    </LiveKitSyncProvider>
  );
}
