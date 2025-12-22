import { Text } from "@react-three/drei";
import { BvhPhysicsBody, PrototypeBox } from "@react-three/viverse";
import { memo } from "react";

/**
 * A simple single-cell scaffold to act as a fallback floor.
 */
export const SimpleScaffold = memo(() => {
  const SIZE = 20;
  return (
    <group position={[0, 0, 0]}>
      <BvhPhysicsBody kinematic>
        <PrototypeBox scale={[SIZE, 1, SIZE]} position={[0, -2, 0]} />
      </BvhPhysicsBody>
      <Text
        fontSize={1}
        position-y={-1.49}
        rotation-x={-Math.PI / 2}
        fontWeight={"bold"}
        textAlign="center"
        lineHeight={1}
        receiveShadow
      >
        Origin Cell
        <meshStandardMaterial color="white" />
      </Text>
    </group>
  );
});
