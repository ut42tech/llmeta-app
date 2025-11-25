"use client";

import { CaptionWindow } from "@/components/overlay/caption/CaptionWindow";
import { Dock } from "@/components/overlay/Dock";
import { ChatPanel } from "@/components/overlay/dock/ChatPanel";
import { StatusBar } from "@/components/overlay/StatusBar";

export const OverlayUI = () => {
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
        <Dock />
        <ChatPanel />
      </div>
    </div>
  );
};
