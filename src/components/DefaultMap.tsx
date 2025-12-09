import { Gltf } from "@react-three/drei";
import { BvhPhysicsBody } from "@react-three/viverse";

export function DefaultMap() {
  return (
    <BvhPhysicsBody kinematic>
      <Gltf receiveShadow position={[0, -2, 0]} src="/models/map.glb" />
    </BvhPhysicsBody>
  );
}
