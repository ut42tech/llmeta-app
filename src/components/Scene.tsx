import { Sky } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import type { DirectionalLight, Object3D } from "three";
import { DebugPanel } from "@/components/DebugPanel";
import { InfiniteWorld } from "@/components/InfiniteWorld";
import { LocalCharacter } from "@/components/LocalCharacter";
import { RemotePlayers } from "@/components/RemotePlayers";
import { LIGHTING } from "@/constants";
import { LIVEKIT_CONFIG, SYNC_PROVIDER } from "@/constants/sync";
import { useCharacterController } from "@/hooks/useCharacterController";
import { useColyseusLifecycle } from "@/hooks/useColyseusLifecycle";
import { useLightController } from "@/hooks/useLightController";
import { useLiveKitLifecycle } from "@/hooks/useLiveKitLifecycle";
import { useSyncClient } from "@/hooks/useSyncClient";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";

/**
 * Main scene component.
 * Manages the local player, remote players, and the world.
 */
export const Scene = () => {
  const isLiveKit = SYNC_PROVIDER === "livekit";
  useColyseusLifecycle(undefined, { enabled: !isLiveKit });
  useLiveKitLifecycle({
    enabled: isLiveKit,
    roomName: LIVEKIT_CONFIG.defaultRoom,
  });

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

  // Light settings
  const directionalLightIntensity = useMemo(
    () => LIGHTING.DIRECTIONAL_INTENSITY,
    [],
  );
  const ambientLightIntensity = useMemo(() => LIGHTING.AMBIENT_INTENSITY, []);

  return (
    <>
      <DebugPanel />

      <Sky />
      <directionalLight
        intensity={directionalLightIntensity}
        position={[-10, 10, -10]}
        castShadow
        ref={directionalLightRef}
      />
      <ambientLight intensity={ambientLightIntensity} />

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
};
