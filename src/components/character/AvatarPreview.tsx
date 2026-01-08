"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { RunTimeline } from "@react-three/timeline";
import {
  CharacterAnimationAction,
  CharacterAnimationLayer,
  CharacterModelProvider,
  useCharacterModelLoader,
} from "@react-three/viverse";
import { Suspense } from "react";
import { IdleAnimationUrl } from "@/constants/animations";

function AvatarModel({ vrmUrl }: { vrmUrl: string }) {
  const model = useCharacterModelLoader({
    useViverseAvatar: false,
    castShadow: true,
    url: vrmUrl,
    type: "vrm",
  });

  useFrame(({ clock }) => {
    if (model.scene) {
      model.scene.rotation.y =
        Math.PI + Math.sin(clock.elapsedTime * 0.3) * 0.15;
    }
  });

  if (!model.scene) return null;

  return (
    <CharacterModelProvider model={model}>
      <RunTimeline>
        <CharacterAnimationLayer name="idle">
          <CharacterAnimationAction url={IdleAnimationUrl} scaleTime={0.8} />
        </CharacterAnimationLayer>
      </RunTimeline>
      <primitive object={model.scene} position={[0, -0.5, 0]} scale={0.85} />
    </CharacterModelProvider>
  );
}

const CAMERA = { position: [0, 0.2, 3.2] as const, fov: 28 };
const ORBIT_TARGET: [number, number, number] = [0, 0.2, 0];

interface AvatarPreviewProps {
  vrmUrl: string;
  className?: string;
}

export function AvatarPreview({ vrmUrl, className }: AvatarPreviewProps) {
  return (
    <div className={className}>
      <Canvas camera={CAMERA} style={{ background: "transparent" }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-5, 3, -5]} intensity={0.4} />
        <Suspense fallback={null}>
          <AvatarModel vrmUrl={vrmUrl} />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
          target={ORBIT_TARGET}
        />
      </Canvas>
    </div>
  );
}
