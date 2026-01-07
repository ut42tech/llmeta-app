"use client";

import { AIChatButton } from "@/components/hud/dock/AIChatButton";
import { SettingsDrawer } from "@/components/hud/dock/SettingsDrawer";
import { ViewToggleButton } from "@/components/hud/dock/ViewToggleButton";
import { VoiceChatButton } from "@/components/hud/dock/VoiceChatButton";
import { TooltipProvider } from "@/components/ui/tooltip";

export const Dock = () => {
  return (
    <TooltipProvider>
      {/* Dock */}
      <div className="pointer-events-auto absolute inset-x-0 bottom-6 flex items-center justify-center gap-2">
        {/* Right: AI Chat */}
        <div className="fixed right-6">
          <AIChatButton />
        </div>

        {/* Center: Main Controls */}
        <ViewToggleButton />
        <VoiceChatButton />
        <SettingsDrawer />
      </div>
    </TooltipProvider>
  );
};
