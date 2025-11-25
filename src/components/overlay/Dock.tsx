"use client";

import { ChatButton } from "@/components/overlay/dock/ChatButton";
import { SettingsDrawer } from "@/components/overlay/dock/SettingsDrawer";
import { VoiceChatButton } from "@/components/overlay/dock/VoiceChatButton";
import { WorldInfoDrawer } from "@/components/overlay/dock/WorldInfoDrawer";
import { YourInfoDrawer } from "@/components/overlay/dock/YourInfoDrawer";
import { ButtonGroup } from "@/components/ui/button-group";
import { TooltipProvider } from "@/components/ui/tooltip";

export const Dock = () => {
  return (
    <TooltipProvider>
      {/* Dock */}
      <div className="absolute inset-x-0 bottom-6 flex items-center justify-center pointer-events-auto gap-2">
        {/* Left: Chat */}
        <div className="fixed left-6">
          <ChatButton />
        </div>

        {/* Center: Main Controls */}
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
