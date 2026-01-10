"use client";

import { Loader, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva, useControls } from "leva";
import { ConnectionState as LiveKitConnectionState } from "livekit-client";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { HUD } from "@/components/hud/HUD";
import { LiveKitSyncProvider } from "@/components/providers";
import { Scene } from "@/components/scene";
import { Spinner } from "@/components/ui/spinner";
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
      router.replace("/");
    }
  }, [hasJoinedWorld, router]);

  if (!isConnected) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <Spinner className="size-8 text-white" />
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
          className="fixed! h-screen! w-screen! touch-none"
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
  const { instanceId } = useParams<{ instanceId: string }>();

  return (
    <LiveKitSyncProvider instanceId={instanceId}>
      <ExperienceContent />
    </LiveKitSyncProvider>
  );
}
