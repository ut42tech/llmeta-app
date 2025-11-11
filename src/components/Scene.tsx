import { Sky } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {
  SimpleCharacter,
  type SimpleCharacterImpl,
} from "@react-three/viverse";
import type { Room } from "colyseus.js";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { type DirectionalLight, Euler, Vector3 } from "three";
import { DebugPanel } from "@/components/DebugPanel";
import { InfiniteWorld } from "@/components/InfiniteWorld";
import { RemotePlayers } from "@/components/RemotePlayers";
import { LIGHTING, PHYSICS } from "@/constants";
import { useColyseusLifecycle } from "@/hooks/useColyseusLifecycle";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";
import { useWorldStore } from "@/stores/worldStore";
import { useColyseusRoom } from "@/utils/colyseus";

const LIGHT_OFFSET = new Vector3(
  LIGHTING.LIGHT_OFFSET.x,
  LIGHTING.LIGHT_OFFSET.y,
  LIGHTING.LIGHT_OFFSET.z,
);
const tmpVec = new Vector3();

/**
 * Main scene component.
 * Manages the local player, remote players, and the world.
 */
export const Scene = () => {
  useColyseusLifecycle();

  const room = useColyseusRoom();
  const [isConnected, setIsConnected] = useState(false);

  const setSessionId = useLocalPlayerStore((state) => state.setSessionId);
  const setPosition = useLocalPlayerStore((state) => state.setPosition);
  const setRotation = useLocalPlayerStore((state) => state.setRotation);
  const setAction = useLocalPlayerStore((state) => state.setAction);
  const sendMovement = useLocalPlayerStore((state) => state.sendMovement);
  const updateCurrentGridCell = useWorldStore(
    (state) => state.updateCurrentGridCell,
  );

  const characterRef = useRef<SimpleCharacterImpl>(null);
  const directionalLight = useRef<DirectionalLight | null>(null);
  const { scene } = useThree();

  // Handle session connection
  useEffect(() => {
    if (room?.sessionId) {
      setSessionId(room.sessionId);
      setIsConnected(true);
      console.log("[Scene] Colyseus connected, session ID:", room.sessionId);
    }
  }, [room?.sessionId, setSessionId]);

  // Add/remove light target
  useEffect(() => {
    const light = directionalLight.current;
    if (!light) {
      return;
    }

    scene.add(light.target);
    return () => {
      scene.remove(light.target);
    };
  }, [scene]);

  // Main loop
  useFrame(() => {
    const character = characterRef.current;
    const light = directionalLight.current;

    if (!character || !light) {
      return;
    }

    // Reset on fall
    if (character.position.y < PHYSICS.RESET_Y_THRESHOLD) {
      character.position.copy(new Vector3());
    }

    // Update player info
    setPosition(character.position);
    setRotation(character.model?.scene.rotation || new Euler());
    setAction(character.actions);

    // Send movement to server
    if (isConnected && room) {
      sendMovement((room as unknown as Room) || undefined);
    }

    // Update grid cell
    updateCurrentGridCell(character.position);

    // Update light position (shadow follows character)
    light.target.position.copy(character.position);
    tmpVec.copy(light.target.position).add(LIGHT_OFFSET);
    light.position.copy(tmpVec);
  });

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
        ref={directionalLight}
      />
      <ambientLight intensity={ambientLightIntensity} />

      {/* Local Player */}
      <Suspense fallback={null}>
        <SimpleCharacter ref={characterRef} />
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
