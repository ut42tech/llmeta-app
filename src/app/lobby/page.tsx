"use client";

import { ConnectionState as LiveKitConnectionState } from "livekit-client";
import { AlertTriangle, Globe, Loader2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { AvatarPicker } from "@/components/hud/dock/AvatarPicker";
import { LiveKitSyncProvider } from "@/components/LiveKitSyncProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AVATAR_LIST } from "@/constants/avatars";
import { useSyncClient } from "@/hooks/livekit/useSyncClient";
import { type Locale, localeNames, locales } from "@/i18n/config";
import { useConnectionStore } from "@/stores/connectionStore";
import { useLanguageStore } from "@/stores/languageStore";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";
import type { ViverseAvatar } from "@/types/player";

function LobbyContent() {
  const router = useRouter();
  const t = useTranslations("joinWorld");
  const tLobby = useTranslations("lobby");

  const { connectionState } = useSyncClient();
  const { status: connectionStatus, error: connectionError } =
    useConnectionStore();

  const hasJoinedWorld = useLocalPlayerStore((state) => state.hasJoinedWorld);
  const setUsername = useLocalPlayerStore((state) => state.setUsername);
  const setCurrentAvatar = useLocalPlayerStore(
    (state) => state.setCurrentAvatar,
  );
  const setHasJoinedWorld = useLocalPlayerStore(
    (state) => state.setHasJoinedWorld,
  );
  const { locale, setLocale } = useLanguageStore();

  const [inputUsername, setInputUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<ViverseAvatar | null>(
    null,
  );
  const [isReadyToEnter, setIsReadyToEnter] = useState(false);

  const isConnected = connectionState === LiveKitConnectionState.Connected;
  const isConnecting =
    connectionState === LiveKitConnectionState.Connecting ||
    connectionStatus === "connecting";
  const isFailed = connectionStatus === "failed";

  const isFormValid =
    inputUsername.trim().length > 0 && selectedAvatar !== null;

  // Handle form submission
  const handleJoinWorld = () => {
    if (!isFormValid) return;

    // Save to store
    setUsername(inputUsername.trim());
    if (selectedAvatar) {
      setCurrentAvatar(selectedAvatar);
    }

    // Mark as ready to enter (will trigger navigation when connected)
    setHasJoinedWorld(true);
    setIsReadyToEnter(true);
  };

  // Navigate to experience when connected and ready
  useEffect(() => {
    if (isReadyToEnter && isConnected && hasJoinedWorld) {
      router.push("/experience");
    }
  }, [isReadyToEnter, isConnected, hasJoinedWorld, router]);

  // Handle retry
  const handleRetry = () => {
    window.location.reload();
  };

  const handleAvatarSelect = (avatar: ViverseAvatar) => {
    setSelectedAvatar(avatar);
  };

  // Connection status display
  const renderConnectionStatus = () => {
    if (isFailed) {
      return (
        <div className="flex items-center gap-2 text-red-500">
          <AlertTriangle className="size-4" />
          <span className="text-sm">{tLobby("failed")}</span>
          {connectionError && (
            <span className="text-xs text-muted-foreground">
              ({connectionError})
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
            className="ml-2"
          >
            <RefreshCw className="size-3 mr-1" />
            {tLobby("retry")}
          </Button>
        </div>
      );
    }

    if (isReadyToEnter && isConnecting) {
      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          <span className="text-sm">{tLobby("connecting")}</span>
        </div>
      );
    }

    if (isReadyToEnter && isConnected) {
      return (
        <div className="flex items-center gap-2 text-green-500">
          <Loader2 className="size-4 animate-spin" />
          <span className="text-sm">{tLobby("connected")}</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-md mx-4">
        <div className="bg-background border rounded-lg shadow-xl p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <Globe className="size-5" />
              {t("title")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t("description")}
            </p>
          </div>

          <ScrollArea className="max-h-[60vh]">
            <div className="flex flex-col gap-6 py-2 pr-4">
              {/* Language Selection */}
              <div className="flex flex-col gap-2">
                <Label>{t("languageLabel")}</Label>
                <ToggleGroup
                  type="single"
                  value={locale}
                  onValueChange={(value) => value && setLocale(value as Locale)}
                  variant="outline"
                >
                  {locales.map((loc) => (
                    <ToggleGroupItem
                      key={loc}
                      value={loc}
                      aria-label={localeNames[loc]}
                    >
                      {localeNames[loc]}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>

              {/* Username Input */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="username" className="flex items-center gap-2">
                  {t("usernameLabel")}
                </Label>
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

              {/* Avatar Selection */}
              <div className="flex flex-col gap-2">
                <Label>{t("avatarLabel")}</Label>
                <AvatarPicker
                  avatars={AVATAR_LIST}
                  selectedId={selectedAvatar?.id}
                  onSelect={handleAvatarSelect}
                  disabled={isReadyToEnter}
                />
              </div>

              {/* Privacy Warning */}
              <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-4">
                <div className="flex items-start gap-3">
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
              </div>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="mt-6 flex flex-col gap-4">
            {/* Connection Status */}
            <div className="min-h-[24px]">{renderConnectionStatus()}</div>

            {/* Submit Button */}
            <Button
              type="button"
              onClick={handleJoinWorld}
              disabled={!isFormValid || isReadyToEnter}
              className="w-full"
            >
              {isReadyToEnter ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  {tLobby("waitingForConnection")}
                </>
              ) : (
                t("continueButton")
              )}
            </Button>
          </div>
        </div>
      </div>
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
