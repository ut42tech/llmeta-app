import { useFrame } from "@react-three/fiber";
import { Container, Text } from "@react-three/uikit";
import * as Icons from "@react-three/uikit-lucide";
import { Suspense, useRef } from "react";
import type { Object3D } from "three";

type PlayerTagProps = {
  displayName: string;
  isMuted?: boolean;
  isSpeaking?: boolean;
};

export function PlayerTag({
  displayName,
  isMuted = false,
  isSpeaking = false,
}: PlayerTagProps) {
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
          paddingX={8}
          height={20}
          backgroundColor="rgba(255, 255, 255, 0.5)"
          alignItems="center"
          flexDirection="row"
          gap={4}
        >
          {isMuted ? (
            <Icons.VolumeX width={10} color={"red"} />
          ) : (
            <Icons.Volume2
              width={10}
              color={isSpeaking ? "green" : undefined}
            />
          )}
          <Text fontWeight="bold" fontSize={8}>
            {displayName}
          </Text>
        </Container>
      </Suspense>
    </group>
  );
}
