import { useFrame } from "@react-three/fiber";
import { memo, useRef } from "react";
import type { Group } from "three";
import { useAnimationController } from "@/hooks/useAnimationController";
import { useCharacterModel } from "@/hooks/useCharacterModel";
import type { RemotePlayerData } from "@/stores/remotePlayersStore";

type RemotePlayerProps = {
  player: RemotePlayerData;
};

const POSITION_LERP_FACTOR = 0.2;

const RemotePlayerComponent = ({ player }: RemotePlayerProps) => {
  const groupRef = useRef<Group>(null);

  const { mixer, actions, isLoaded } = useCharacterModel(groupRef);

  useAnimationController({
    animation: player.animation,
    mixer,
    actions,
    isModelLoaded: isLoaded,
  });

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group || !isLoaded) return;

    group.position.lerp(player.position, POSITION_LERP_FACTOR);

    const { rotation } = player;
    group.rotation.set(rotation.x, rotation.y, rotation.z);

    mixer?.update(delta);
  });

  return <group ref={groupRef} />;
};

export const RemotePlayer = memo(
  RemotePlayerComponent,
  (prev, next) =>
    prev.player.sessionId === next.player.sessionId &&
    prev.player.animation === next.player.animation &&
    prev.player.position.equals(next.player.position) &&
    prev.player.rotation.equals(next.player.rotation),
);
