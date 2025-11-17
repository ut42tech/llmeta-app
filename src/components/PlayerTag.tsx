import { useFrame } from "@react-three/fiber";
import { Container, Text } from "@react-three/uikit";
import { Suspense, useRef } from "react";
import type { Object3D } from "three";

type PlayerTagProps = {
  displayName: string;
};

export const PlayerTag = ({ displayName }: PlayerTagProps) => {
  const ref = useRef<Object3D>(null);

  useFrame((state) => {
    if (ref.current == null) {
      return;
    }
    ref.current.lookAt(state.camera.position);
  });

  return (
    <group ref={ref} position-y={2}>
      <Suspense fallback={null}>
        <Container
          borderRadius={10}
          paddingX={2}
          height={20}
          backgroundColor="rgba(255, 255, 255, 0.5)"
          alignItems="center"
        >
          <Text fontWeight="bold" fontSize={8} margin={4}>
            {displayName}
          </Text>
        </Container>
      </Suspense>
    </group>
  );
};
