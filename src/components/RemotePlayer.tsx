import type { VRM } from "@pixiv/three-vrm";
import { VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import type { Group } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { RemotePlayerData } from "@/stores/remotePlayersStore";

type RemotePlayerProps = {
  player: RemotePlayerData;
};

/**
 * リモートプレイヤーコンポーネント
 * VRMアバターとして表示し、位置と角度を同期
 */
export const RemotePlayer = ({ player }: RemotePlayerProps) => {
  const groupRef = useRef<Group>(null);
  const [vrm, setVrm] = useState<VRM | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // VRMアバターの読み込み
  useEffect(() => {
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));

    loader.load(
      "/models/sample.vrm",
      (gltf) => {
        const loadedVrm = gltf.userData.vrm as VRM;
        VRMUtils.rotateVRM0(loadedVrm);

        loadedVrm.scene.rotation.y = Math.PI;

        setVrm(loadedVrm);
        setIsLoading(false);
      },
      undefined,
      (error) => {
        console.error("VRM loading error:", error);
        setIsLoading(false);
      },
    );
  }, []);

  // VRMをシーンに追加
  useEffect(() => {
    if (!vrm || !groupRef.current) return;

    groupRef.current.add(vrm.scene);

    return () => {
      if (groupRef.current && vrm) {
        groupRef.current.remove(vrm.scene);
      }
    };
  }, [vrm]);

  // 位置と角度の同期
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const lerpFactor = 1 - Math.exp(-10 * delta);

    // 位置の補間
    groupRef.current.position.lerp(player.position, lerpFactor);

    // 角度の補間
    groupRef.current.rotation.x +=
      (player.rotation.x - groupRef.current.rotation.x) * lerpFactor;
    groupRef.current.rotation.y +=
      (player.rotation.y - groupRef.current.rotation.y) * lerpFactor;
    groupRef.current.rotation.z +=
      (player.rotation.z - groupRef.current.rotation.z) * lerpFactor;

    // VRMの更新
    if (vrm) {
      vrm.update(delta);
    }
  });

  return (
    <group ref={groupRef} position={player.position} rotation={player.rotation}>
      {/* ローディング中はシンプルなキューブを表示 */}
      {isLoading && (
        <mesh position={[0, 1, 0]} castShadow receiveShadow>
          <boxGeometry args={[1, 2, 1]} />
          <meshStandardMaterial color="#4080ff" opacity={0.5} transparent />
        </mesh>
      )}
    </group>
  );
};
