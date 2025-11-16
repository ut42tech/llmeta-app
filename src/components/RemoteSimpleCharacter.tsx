"use client";
import { useFrame } from "@react-three/fiber";
import {
  CharacterModelProvider,
  useCharacterModelLoader,
} from "@react-three/viverse";
import { useEffect, useRef } from "react";
import type { Object3D } from "three";
import { PlayerTag } from "@/components/PlayerTag";
import { RemoteCharacterAnimations } from "@/components/RemoteCharacterAnimations";
import { ORIENTATION } from "@/constants";
import {
  usePositionBuffer,
  useRotationBuffer,
} from "@/hooks/useSnapshotBuffer";
import type { RemotePlayerData } from "@/stores/remotePlayersStore";

export type RemoteSimpleCharacterProps = {
  player: RemotePlayerData;
};

export const RemoteSimpleCharacter = ({
  player,
}: RemoteSimpleCharacterProps) => {
  const groupRef = useRef<Object3D>(null);

  // Load character model using the new API
  // Note: Using default VRM model for now
  // TODO: Add support for custom avatars from player.avatar
  const model = useCharacterModelLoader({
    useViverseAvatar: true,
    // url: player.avatar?.vrmUrl, // Uncomment when avatar data is available
    // type: 'vrm',
  });

  // Interpolate position and rotation (snapshot smoothing)
  const smoothPosition = usePositionBuffer(player.position);
  const smoothRotationQuat = useRotationBuffer(player.rotation);

  // Update group position and model rotation
  useFrame(() => {
    const group = groupRef.current;
    if (!group || !model) return;

    group.position.copy(smoothPosition);
    model.scene.quaternion.copy(smoothRotationQuat);
  });

  // Initialize position and rotation
  useEffect(() => {
    const group = groupRef.current;
    if (!group || !model) return;

    group.position.copy(player.position);
    model.scene.rotation.set(
      player.rotation.x,
      player.rotation.y + ORIENTATION.REMOTE_Y_OFFSET,
      player.rotation.z,
    );
  }, [
    model,
    player.position,
    player.rotation.x,
    player.rotation.y,
    player.rotation.z,
  ]);

  if (!model) {
    return null;
  }

  return (
    <group ref={groupRef}>
      <CharacterModelProvider model={model}>
        <RemoteCharacterAnimations currentAnimation={player.animation} />
        <primitive object={model.scene} />
        <PlayerTag displayName={player.username} />
      </CharacterModelProvider>
    </group>
  );
};
