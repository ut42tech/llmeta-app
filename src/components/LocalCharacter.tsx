import { useFrame } from "@react-three/fiber";
import {
  CharacterModelProvider,
  updateSimpleCharacterVelocity,
  useBvhCharacterPhysics,
  useCharacterCameraBehavior,
  useCharacterModelLoader,
  useKeyboardLocomotionActionBindings,
  usePointerCaptureRotateZoomActionBindings,
} from "@react-three/viverse";
import { useEffect } from "react";
import type { Object3D } from "three";
import { CharacterAnimation } from "@/components/CharacterAnimation";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";

export function LocalCharacter({
  innerRef,
}: {
  innerRef?: React.Ref<Object3D | null>;
}) {
  const avatar = useLocalPlayerStore((state) => state.currentAvatar);

  const model = useCharacterModelLoader({
    castShadow: true,
    url: avatar?.vrmUrl ?? "models/avatar_01.vrm",
  });

  const physics = useBvhCharacterPhysics(model.scene);

  usePointerCaptureRotateZoomActionBindings();
  useKeyboardLocomotionActionBindings();

  useFrame((state) => updateSimpleCharacterVelocity(state.camera, physics));

  useCharacterCameraBehavior(model.scene, {
    zoom: { speed: 0 },
    characterBaseOffset: [0, 1.3, 0],
  });

  useFrame((state) => {
    model.scene.rotation.y = state.camera.rotation.y;
  });

  useEffect(() => {
    if (!innerRef) return;
    if (typeof innerRef === "function") {
      innerRef(model.scene);
      return () => {
        innerRef(null);
      };
    }
    (innerRef as React.RefObject<Object3D | null>).current = model.scene;
    return () => {
      (innerRef as React.RefObject<Object3D | null>).current = null;
    };
  }, [innerRef, model.scene]);

  return (
    <CharacterModelProvider model={model}>
      <CharacterAnimation physics={physics} />
      <primitive object={model.scene} />
    </CharacterModelProvider>
  );
}
