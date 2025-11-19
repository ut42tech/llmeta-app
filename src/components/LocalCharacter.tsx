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
import { useEffect, useRef } from "react";
import type { Object3D } from "three";
import { Euler, Vector3 } from "three";
import { LocalCharacterAnimation } from "@/components/LocalCharacterAnimation";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";

export function LocalCharacter({
  innerRef,
}: {
  innerRef?: React.Ref<Object3D | null>;
}) {
  const avatar = useLocalPlayerStore((state) => state.currentAvatar);
  const sessionId = useLocalPlayerStore((state) => state.sessionId);
  const currentPosition = useLocalPlayerStore((state) => state.position);
  const currentRotation = useLocalPlayerStore((state) => state.rotation);

  const savedPosition = useRef<Vector3>(new Vector3());
  const savedRotation = useRef<Euler>(new Euler());
  const previousAvatarUrl = useRef<string | undefined>(undefined);

  const avatarUrl = avatar?.vrmUrl ?? "/models/avatar_01.vrm";
  if (previousAvatarUrl.current && previousAvatarUrl.current !== avatarUrl) {
    savedPosition.current.copy(currentPosition);
    savedRotation.current.copy(currentRotation);
  }
  previousAvatarUrl.current = avatarUrl;

  const model = useCharacterModelLoader({
    useViverseAvatar: false,
    castShadow: true,
    url: `${avatarUrl}${avatarUrl.includes("?") ? "&" : "?"}instance=${encodeURIComponent(sessionId || "local")}`,
    type: "vrm",
  });

  const physics = useBvhCharacterPhysics(model.scene);

  useEffect(() => {
    if (!model.scene) return;

    if (savedPosition.current.lengthSq() > 0) {
      model.scene.position.copy(savedPosition.current);
      model.scene.rotation.copy(savedRotation.current);
    }
  }, [model.scene]);

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
      <LocalCharacterAnimation physics={physics} />
      <primitive object={model.scene} />
    </CharacterModelProvider>
  );
}
