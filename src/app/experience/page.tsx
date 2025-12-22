"use client";

import { Loader, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva, useControls } from "leva";
import { ConnectionState as LiveKitConnectionState } from "livekit-client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { HUD } from "@/components/hud/HUD";
import { LiveKitSyncProvider } from "@/components/LiveKitSyncProvider";
import { Scene } from "@/components/Scene";
import { useSyncClient } from "@/hooks/livekit/useSyncClient";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";

const Viverse = dynamic(
  () => import("@react-three/viverse").then((mod) => mod.Viverse),
  { ssr: false },
);

function ExperienceContent() {
  const router = useRouter();
  const { stats } = useControls({ stats: false });
  const { connectionState } = useSyncClient();
  const hasJoinedWorld = useLocalPlayerStore((state) => state.hasJoinedWorld);

  const isConnected = connectionState === LiveKitConnectionState.Connected;

  useEffect(() => {
    if (!hasJoinedWorld) {
      router.replace("/lobby");
    }
  }, [hasJoinedWorld, router]);

  if (!isConnected) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <Leva titleBar={{ title: "Debug Panel" }} collapsed hidden />

      <Loader />
      {stats && <Stats />}

      <HUD />

      <Viverse>
        <Canvas
          className="fixed! w-screen! h-screen! touch-none"
          shadows
          camera={{ position: [3, 3, 3], fov: 40 }}
          gl={{
            preserveDrawingBuffer: true,
            antialias: true,
            powerPreference: "high-performance",
          }}
          flat
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </Viverse>
    </>
  );
}

export default function ExperiencePage() {
  return (
    <LiveKitSyncProvider>
      <ExperienceContent />
    </LiveKitSyncProvider>
  );
}
