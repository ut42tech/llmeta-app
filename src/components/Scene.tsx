import { Sky } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { DirectionalLight, Object3D } from "three";
import { DebugPanel } from "@/components/DebugPanel";
import { InfiniteWorld } from "@/components/InfiniteWorld";
import { LocalCharacter } from "@/components/LocalCharacter";
import { RemotePlayers } from "@/components/RemotePlayers";
import { LIGHTING } from "@/constants/world";
import { useCharacterController } from "@/hooks/useCharacterController";
import { useLightController } from "@/hooks/useLightController";
import { useSyncClient } from "@/hooks/useSyncClient";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";

/**
 * Main scene component.
 * Manages the local player, remote players, and the world.
 */
export function Scene() {
  const syncClient = useSyncClient();

  const characterRef = useRef<Object3D>(null);
  const directionalLightRef = useRef<DirectionalLight | null>(null);

  const isFPV = useLocalPlayerStore((s) => s.isFPV);

  // Handle character movement, teleport, and sync
  useCharacterController(
    characterRef,
    syncClient.sendMove,
    syncClient.isConnected,
  );

  // Handle light following character
  useLightController(characterRef, directionalLightRef);

  return (
    <>
      <DebugPanel />

      <Sky />
      <directionalLight
        intensity={LIGHTING.DIRECTIONAL_INTENSITY}
        position={[-10, 10, -10]}
        castShadow
        ref={directionalLightRef}
      />
      <ambientLight intensity={LIGHTING.AMBIENT_INTENSITY} />

      {/* Local Player */}
      <Suspense fallback={null}>
        <group visible={!isFPV}>
          <LocalCharacter key={syncClient.sessionId} innerRef={characterRef} />
        </group>
      </Suspense>

      {/* Remote Players */}
      <Suspense fallback={null}>
        <RemotePlayers />
      </Suspense>

      <Suspense fallback={null}>
        <InfiniteWorld />
      </Suspense>
    </>
  );
}
