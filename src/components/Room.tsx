import { Gltf, useGLTF } from "@react-three/drei";

export function Room({ ...props }) {
  return (
    <group {...props} dispose={null}>
      <Gltf src="/models/room.glb" receiveShadow />
    </group>
  );
}

useGLTF.preload("/models/room.glb");
