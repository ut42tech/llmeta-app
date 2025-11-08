import { VRM } from "@pixiv/three-vrm";
import { useFrame } from "@react-three/fiber";
import { memo, useRef } from "react";
import { type Group, Quaternion } from "three";
import { PERFORMANCE } from "@/constants";
import { useRemoteCharacter } from "@/hooks/useRemoteCharacter";
import { useRemoteCharacterAnimation } from "@/hooks/useRemoteCharacterAnimation";
import type { RemotePlayerData } from "@/stores/remotePlayersStore";

type RemotePlayerProps = {
  player: RemotePlayerData;
};

const tmpQuat = new Quaternion();

/**
 * リモートプレイヤーコンポーネント
 * 位置と回転を滑らかに補間し、アニメーションを再生する
 */
const RemotePlayerComponent = ({ player }: RemotePlayerProps) => {
  const groupRef = useRef<Group>(null);
  const { mixer, actions, model, characterGroup, isLoaded } =
    useRemoteCharacter(groupRef);

  useRemoteCharacterAnimation({
    animation: player.animation,
    mixer,
    actions,
    isModelLoaded: isLoaded,
  });

  useFrame((_, delta) => {
    if (!characterGroup || !isLoaded) return;

    characterGroup.position.lerp(
      player.position,
      PERFORMANCE.POSITION_LERP_FACTOR,
    );

    tmpQuat.setFromEuler(player.rotation);
    characterGroup.quaternion.slerp(tmpQuat, PERFORMANCE.ROTATION_LERP_FACTOR);

    if (model instanceof VRM) {
      model.update(delta);
    }

    mixer?.update(delta);
  });

  return <group ref={groupRef} />;
};

// プレイヤーデータの変更時のみ再レンダリング
export const RemotePlayer = memo(RemotePlayerComponent, (prev, next) => {
  return (
    prev.player.sessionId === next.player.sessionId &&
    prev.player.animation === next.player.animation &&
    prev.player.position.equals(next.player.position) &&
    prev.player.rotation.equals(next.player.rotation)
  );
});
