"use client";

import { AIChatWindow } from "@/components/hud/ai-chat/AIChatWindow";
import { CaptionWindow } from "@/components/hud/caption/CaptionWindow";
import { ChatWindow } from "@/components/hud/chat/ChatWindow";
import { Dock } from "@/components/hud/Dock";
import { StatusBar } from "@/components/hud/StatusBar";
import { useTextChat } from "@/hooks/useTextChat";
import { useChatStore } from "@/stores/chatStore";

export const HUD = () => {
  const { isOpen: isTextChatOpen } = useTextChat();
  const isAIChatOpen = useChatStore((state) => state.aiChat.isOpen);

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
        {isTextChatOpen && (
          <div className="pointer-events-auto fixed bottom-18 left-6">
            <ChatWindow />
          </div>
        )}
        {/* AI Chat Window */}
        {isAIChatOpen && (
          <div className="pointer-events-auto fixed bottom-18 right-6">
            <AIChatWindow />
          </div>
        )}
        <Dock />
      </div>
    </div>
  );
};
