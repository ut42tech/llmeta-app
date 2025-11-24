"use client";

import { Caption } from "@/components/overlay/Caption";
import { Dock } from "@/components/overlay/Dock";
import { ChatWindow } from "@/components/overlay/dock-action/ChatWindow";
import { StatusBar } from "@/components/overlay/StatusBar";

export const OverlayUI = () => {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <StatusBar />
      <Caption />
      <Dock />
      <ChatWindow />
    </div>
  );
};
