"use client";

import { SettingsDrawer } from "@/components/overlay/dock/SettingsDrawer";
import { VoiceChatButton } from "@/components/overlay/dock/VoiceChatButton";
import { WorldInfoDrawer } from "@/components/overlay/dock/WorldInfoDrawer";
import { YourInfoDrawer } from "@/components/overlay/dock/YourInfoDrawer";
import { TooltipProvider } from "@/components/ui/tooltip";

export const Dock = () => {
  return (
    <TooltipProvider>
      <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-3 pointer-events-auto">
        <WorldInfoDrawer />
        <YourInfoDrawer />
        <VoiceChatButton />
        <SettingsDrawer />
      </div>
    </TooltipProvider>
  );
};
