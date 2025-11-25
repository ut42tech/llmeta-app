"use client";

import { SettingsDrawer } from "@/components/overlay/dock/SettingsDrawer";
import { VoiceChatButton } from "@/components/overlay/dock/VoiceChatButton";
import { WorldInfoDrawer } from "@/components/overlay/dock/WorldInfoDrawer";
import { YourInfoDrawer } from "@/components/overlay/dock/YourInfoDrawer";
import { ButtonGroup } from "@/components/ui/button-group";
import { TooltipProvider } from "@/components/ui/tooltip";

export const Dock = () => {
  return (
    <TooltipProvider>
      <div className="absolute inset-x-0 bottom-6 flex items-center justify-center pointer-events-auto gap-2">
        <ButtonGroup>
          <WorldInfoDrawer />
          <YourInfoDrawer />
        </ButtonGroup>
        <VoiceChatButton />
        <SettingsDrawer />
      </div>
    </TooltipProvider>
  );
};
