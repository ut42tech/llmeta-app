"use client";

import { Settings } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Euler, Vector3 } from "three";
import { useShallow } from "zustand/react/shallow";
import { AvatarPicker } from "@/components/overlay/dock/AvatarPicker";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AVATAR_LIST } from "@/constants/avatars";
import { useSyncClient } from "@/hooks/useSyncClient";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";
import { useVoiceChatStore } from "@/stores/voiceChatStore";
import type { ViverseAvatar } from "@/types/multiplayer";

// ---------------------------------------------------------------------------
// Settings Section Components
// ---------------------------------------------------------------------------

type SettingsSectionProps = {
  title: string;
  children: React.ReactNode;
};

const SettingsSection = ({ title, children }: SettingsSectionProps) => (
  <div className="space-y-3">
    <h3 className="text-sm font-semibold">{title}</h3>
    {children}
  </div>
);

type SettingsRowProps = {
  label: string;
  description?: string;
  children: React.ReactNode;
};

const SettingsRow = ({ label, description, children }: SettingsRowProps) => (
  <div className="flex items-center justify-between py-3 border rounded-md px-3">
    <div className="space-y-1">
      <div className="text-sm text-muted-foreground">{label}</div>
      {description && (
        <div className="text-xs text-muted-foreground">{description}</div>
      )}
    </div>
    {children}
  </div>
);

// ---------------------------------------------------------------------------
// Settings Content (Client-only)
// ---------------------------------------------------------------------------

const SettingsContent = () => {
  const { sendProfile } = useSyncClient();

  // Local player state
  const {
    username,
    position,
    rotation,
    setUsername,
    teleport,
    isFPV,
    toggleFPV,
    currentAvatar,
    setCurrentAvatar,
  } = useLocalPlayerStore(
    useShallow((state) => ({
      username: state.username || "Anonymous",
      position: state.position,
      rotation: state.rotation,
      setUsername: state.setUsername,
      teleport: state.teleport,
      isFPV: state.isFPV,
      toggleFPV: state.toggleFPV,
      currentAvatar: state.currentAvatar,
      setCurrentAvatar: state.setCurrentAvatar,
    })),
  );

  // Voice chat state
  const { krispEnabled, krispSupported, setKrispEnabled, initKrisp } =
    useVoiceChatStore(
      useShallow((state) => ({
        krispEnabled: state.krispEnabled,
        krispSupported: state.krispSupported,
        setKrispEnabled: state.setKrispEnabled,
        initKrisp: state.initKrisp,
      })),
    );

  // Local state
  const [nameInput, setNameInput] = useState(username);

  const isNameChanged = useMemo(
    () => nameInput.trim() !== "" && nameInput.trim() !== username,
    [nameInput, username],
  );

  useEffect(() => {
    void initKrisp();
  }, [initKrisp]);

  const handleUpdateName = () => {
    const newName = nameInput.trim();
    if (!newName) return;
    setUsername(newName);
    sendProfile({ username: newName });
  };

  const handleResetPosition = () => {
    teleport(new Vector3(0, 0, 0), new Euler(0, 0, 0));
  };

  const handleSelectAvatar = (avatar: ViverseAvatar) => {
    const currentPosition = position.clone();
    const currentRotation = rotation.clone();
    setCurrentAvatar(avatar);
    teleport(currentPosition, currentRotation);
    sendProfile({ avatar });
  };

  return (
    <div className="px-4 pb-6 space-y-6">
      {/* Username */}
      <SettingsSection title="Username">
        <div className="flex items-center gap-2">
          <Input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Enter your name"
            className="flex-1"
          />
          <Button onClick={handleUpdateName} disabled={!isNameChanged}>
            Update
          </Button>
        </div>
      </SettingsSection>

      {/* Avatar */}
      <SettingsSection title="Avatar">
        <AvatarPicker
          avatars={AVATAR_LIST}
          selectedId={currentAvatar?.id}
          onSelect={handleSelectAvatar}
        />
      </SettingsSection>

      {/* Position */}
      <SettingsSection title="Position">
        <SettingsRow
          label={`x: ${position.x.toFixed(2)} / y: ${position.y.toFixed(2)} / z: ${position.z.toFixed(2)}`}
        >
          <Button variant="outline" onClick={handleResetPosition}>
            Reset
          </Button>
        </SettingsRow>
      </SettingsSection>

      {/* View Mode */}
      <SettingsSection title="View">
        <SettingsRow label={`Mode: ${isFPV ? "First Person" : "Third Person"}`}>
          <Button variant="outline" onClick={toggleFPV}>
            Toggle FPV
          </Button>
        </SettingsRow>
        <p className="text-xs text-muted-foreground">
          Note: FPV is experimental and animations may appear unnatural from
          other players' perspective.
        </p>
      </SettingsSection>

      {/* Audio Settings */}
      <SettingsSection title="Audio Quality">
        <SettingsRow
          label="AI Noise Cancellation"
          description="Advanced noise removal powered by Krisp"
        >
          <Button
            variant={krispEnabled ? "default" : "outline"}
            onClick={() => setKrispEnabled(!krispEnabled)}
            disabled={!krispSupported}
          >
            {krispEnabled ? "Enabled" : "Disabled"}
          </Button>
        </SettingsRow>
        {!krispSupported && (
          <p className="text-xs text-amber-600">
            ⚠️ AI noise cancellation is not supported in this browser. Safari
            17.4+ or Chrome/Edge is required.
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Note: Basic echo cancellation and noise suppression are always
          enabled.
        </p>
      </SettingsSection>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Settings Drawer
// ---------------------------------------------------------------------------

export const SettingsDrawer = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Drawer>
      <Tooltip>
        <TooltipTrigger asChild>
          <DrawerTrigger asChild>
            <Button size="icon-lg" variant="outline" aria-label="Settings">
              <Settings />
            </Button>
          </DrawerTrigger>
        </TooltipTrigger>
        <TooltipContent sideOffset={6}>Settings</TooltipContent>
      </Tooltip>

      <DrawerContent className="flex flex-col overflow-hidden">
        <div className="mx-auto w-full max-w-md flex flex-col flex-1 overflow-hidden">
          <DrawerHeader className="text-left shrink-0">
            <DrawerTitle className="text-2xl font-bold">Settings</DrawerTitle>
            <DrawerDescription className="p-3 bg-neutral-100 rounded-lg">
              ⚙️ Update your preferences
            </DrawerDescription>
          </DrawerHeader>

          <div className="overflow-y-auto flex-1 min-h-0">
            {isClient ? (
              <SettingsContent />
            ) : (
              <div className="px-4 pb-6">
                <div className="h-24 rounded-md border border-dashed bg-muted/30" />
              </div>
            )}
          </div>

          <DrawerFooter className="pt-2 shrink-0">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
