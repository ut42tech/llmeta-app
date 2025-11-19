"use client";

import { Settings } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Euler, Vector3 } from "three";
import { AvatarPicker } from "@/components/overlay/AvatarPicker";
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

const SettingsContentClient = () => {
  const { sendProfile } = useSyncClient();
  const username =
    useLocalPlayerStore((state) => state.username) || "Anonymous";
  const position = useLocalPlayerStore((state) => state.position);
  const rotation = useLocalPlayerStore((state) => state.rotation);
  const setUsername = useLocalPlayerStore((state) => state.setUsername);
  const teleport = useLocalPlayerStore((state) => state.teleport);

  const krispEnabled = useVoiceChatStore((state) => state.krispEnabled);
  const krispSupported = useVoiceChatStore((state) => state.krispSupported);
  const setKrispEnabled = useVoiceChatStore((state) => state.setKrispEnabled);
  const initKrisp = useVoiceChatStore((state) => state.initKrisp);

  const [nameInput, setNameInput] = useState<string>(username);
  const isNameChanged = useMemo(
    () => nameInput.trim() !== "" && nameInput.trim() !== username,
    [nameInput, username],
  );

  const isFPV = useLocalPlayerStore((state) => state.isFPV);
  const toggleFPV = useLocalPlayerStore((state) => state.toggleFPV);

  const currentAvatar = useLocalPlayerStore((state) => state.currentAvatar);
  const setCurrentAvatar = useLocalPlayerStore(
    (state) => state.setCurrentAvatar,
  );

  // Initialize Krisp support check on mount
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

    sendProfile({ avatar: avatar });
  };

  return (
    <div className="px-4 pb-6">
      <div className="space-y-6">
        {/* Username */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Username</h3>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter your name"
              className="flex-1 h-10 px-3 py-2 rounded-md border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <Button onClick={handleUpdateName} disabled={!isNameChanged}>
              Update
            </Button>
          </div>
        </div>

        {/* Avatar */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Avatar</h3>
          <AvatarPicker
            avatars={AVATAR_LIST}
            selectedId={currentAvatar?.id}
            onSelect={handleSelectAvatar}
          />
        </div>

        {/* Position */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Position</h3>
          <div className="flex items-center justify-between py-3 border rounded-md px-3">
            <div className="text-sm text-muted-foreground">
              x: {position.x.toFixed(2)} / y: {position.y.toFixed(2)} / z:{" "}
              {position.z.toFixed(2)}
            </div>
            <Button variant="outline" onClick={handleResetPosition}>
              Reset
            </Button>
          </div>
        </div>
        {/* View Mode */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">View</h3>
          <div className="flex items-center justify-between py-3 border rounded-md px-3">
            <div className="text-sm text-muted-foreground">
              Mode: {isFPV ? "First Person" : "Third Person"}
            </div>
            <Button variant="outline" onClick={toggleFPV}>
              Toggle FPV
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Note: FPV is experimental and animations may appear unnatural from
            other players' perspective.
          </p>
        </div>

        {/* Audio Settings */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Audio Quality</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-3 border rounded-md px-3">
              <div className="space-y-1">
                <div className="text-sm font-medium">AI Noise Cancellation</div>
                <div className="text-xs text-muted-foreground">
                  Advanced noise removal powered by Krisp
                </div>
              </div>
              <Button
                variant={krispEnabled ? "default" : "outline"}
                onClick={() => setKrispEnabled(!krispEnabled)}
                disabled={!krispSupported}
              >
                {krispEnabled ? "Enabled" : "Disabled"}
              </Button>
            </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export const SettingsDrawer = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  return (
    <Drawer>
      <Tooltip>
        <TooltipTrigger asChild>
          <DrawerTrigger asChild>
            <Button size="icon-lg" variant="secondary" aria-label="Settings">
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
              <SettingsContentClient />
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
