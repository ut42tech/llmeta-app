import { Gltf } from "@react-three/drei";
import { BvhPhysicsBody } from "@react-three/viverse";

export function DefaultMap() {
  return (
    <BvhPhysicsBody>
      <Gltf receiveShadow castShadow scale={2.5} src="models/map.glb" />
    </BvhPhysicsBody>
  );
}
