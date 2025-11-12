"use client";

import { Dock } from "@/components/overlay/Dock";
import { StatusBar } from "@/components/overlay/StatusBar";

export const OverlayUI = () => {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <StatusBar />
      <Dock />
    </div>
  );
};
