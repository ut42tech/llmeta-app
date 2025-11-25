"use client";

import { CaptionWindow } from "@/components/overlay/caption/CaptionWindow";
import { ChatWindow } from "@/components/overlay/chat/ChatWindow";
import { Dock } from "@/components/overlay/Dock";
import { StatusBar } from "@/components/overlay/StatusBar";
import { useTextChat } from "@/hooks/useTextChat";

export const OverlayUI = () => {
  const { isOpen } = useTextChat();

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
        {/* Chat Window */}
        {isOpen && (
          <div className="pointer-events-auto fixed bottom-18 left-6">
            <ChatWindow />
          </div>
        )}
        <Dock />
      </div>
    </div>
  );
};
