import { Sky } from "@react-three/drei";
import { EffectComposer, Vignette } from "@react-three/postprocessing";
import { Suspense, useRef } from "react";
import type { DirectionalLight, Object3D } from "three";
import { LocalCharacter } from "@/components/character/LocalCharacter";
import { RemotePlayers } from "@/components/character/RemotePlayers";
import { DebugPanel } from "@/components/common";
import { DefaultMap } from "@/components/scene/DefaultMap";
import { WorldContent } from "@/components/scene/WorldContent";
import { LIGHTING } from "@/constants/world";
import { useSyncClient } from "@/hooks/livekit/useSyncClient";
import { useCharacterController } from "@/hooks/scene/useCharacterController";
import { useLightController } from "@/hooks/scene/useLightController";
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

  useCharacterController(
    characterRef,
    syncClient.sendMove,
    syncClient.isConnected,
  );

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
        <DefaultMap />
      </Suspense>

      {/* World Content */}
      <Suspense fallback={null}>
        <WorldContent />
      </Suspense>

      <EffectComposer multisampling={0}>
        <Vignette offset={0.1} darkness={0.5} />
      </EffectComposer>
    </>
  );
}
