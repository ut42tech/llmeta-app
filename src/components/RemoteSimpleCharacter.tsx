"use client";
import { useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import type { Group } from "three";
import { Euler, Quaternion } from "three";
import { PERFORMANCE } from "@/constants";
import { useGltfCharacterAssets } from "@/hooks/useGltfCharacterAssets";
import { useRemoteCharacterAnimation } from "@/hooks/useRemoteCharacterAnimation";
import type { RemotePlayerData } from "@/stores/remotePlayersStore";

export type RemoteSimpleCharacterProps = {
  player: RemotePlayerData;
};

const tmpQuatFrom = new Quaternion();
const tmpQuatTo = new Quaternion();
const tmpEuler = new Euler();

export const RemoteSimpleCharacter = ({
  player,
}: RemoteSimpleCharacterProps) => {
  const group = useRef<Group>(null);

  const { model, mixer, actions, isLoaded } = useGltfCharacterAssets();

  // アニメーションブレンド（フェード）
  useRemoteCharacterAnimation({
    animation: player.animation,
    mixer,
    actions,
    isModelLoaded: isLoaded,
  });

  // 位置/回転 & mixer の更新
  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    // 位置補間
    g.position.lerp(player.position, PERFORMANCE.POSITION_LERP_FACTOR);
    if (model) {
      tmpQuatFrom.copy(model.quaternion);
      tmpEuler.set(
        player.rotation.x,
        player.rotation.y + Math.PI,
        player.rotation.z,
      );
      tmpQuatTo.setFromEuler(tmpEuler);
      tmpQuatFrom.slerp(tmpQuatTo, PERFORMANCE.ROTATION_LERP_FACTOR);
      model.quaternion.copy(tmpQuatFrom);
    }
    // アニメーション時間更新
    mixer?.update(delta);
  });

  // 初期スナップ
  useEffect(() => {
    const g = group.current;
    if (!g || !model) return;
    g.position.copy(player.position);
    model.rotation.set(
      player.rotation.x,
      player.rotation.y + Math.PI,
      player.rotation.z,
    );
  }, [
    model,
    player.position,
    player.rotation.x,
    player.rotation.y,
    player.rotation.z,
  ]);

  return (
    <Suspense fallback={null}>
      <group ref={group}>{model && <primitive object={model} />}</group>
    </Suspense>
  );
};
