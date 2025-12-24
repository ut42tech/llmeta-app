"use client";

import { AIChatWindow } from "@/components/hud/ai-chat/AIChatWindow";
import { CaptionWindow } from "@/components/hud/caption/CaptionWindow";
import { ChatStream } from "@/components/hud/chat/ChatStream";
import { Dock } from "@/components/hud/Dock";
import { StatusBar } from "@/components/hud/StatusBar";

export const HUD = () => {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex flex-col">
      {/* Top Section */}
      <div className="relative flex-none">
        <StatusBar />
        <CaptionWindow />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom Section */}
      <div className="relative flex-none">
        {/* Chat Stream */}
        <ChatStream />
        {/* AI Chat Dialog */}
        <AIChatWindow />
        <Dock />
      </div>
    </div>
  );
};
