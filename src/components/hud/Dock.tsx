"use client";

import { AIChatButton } from "@/components/hud/dock/AIChatButton";
import { ChatButton } from "@/components/hud/dock/ChatButton";
import { SettingsDrawer } from "@/components/hud/dock/SettingsDrawer";
import { ViewToggleButton } from "@/components/hud/dock/ViewToggleButton";
import { VoiceChatButton } from "@/components/hud/dock/VoiceChatButton";
import { WorldInfoDrawer } from "@/components/hud/dock/WorldInfoDrawer";
import { YourInfoDrawer } from "@/components/hud/dock/YourInfoDrawer";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
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

        {/* Right: AI Chat */}
        <div className="fixed right-6">
          <AIChatButton />
        </div>

        {/* Center: Main Controls */}
        <ButtonGroup>
          <WorldInfoDrawer />
          <YourInfoDrawer />
        </ButtonGroup>
        <ViewToggleButton />
        <VoiceChatButton />
        <LanguageSwitcher />
        <SettingsDrawer />
      </div>
    </TooltipProvider>
  );
};
