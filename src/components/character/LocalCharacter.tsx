import type { CharacterCameraBehaviorOptions } from "@pmndrs/viverse";
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
import { useEffect, useMemo } from "react";
import type { Object3D } from "three";
import { LocalCharacterAnimation } from "@/components/character/LocalCharacterAnimation";
import { useCameraController } from "@/hooks/scene/useCameraController";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";

export function LocalCharacter({
  innerRef,
}: {
  innerRef?: React.Ref<Object3D | null>;
}) {
  const avatar = useLocalPlayerStore((state) => state.currentAvatar);
  const sessionId = useLocalPlayerStore((state) => state.sessionId);
  const isFPV = useLocalPlayerStore((state) => state.isFPV);

  const avatarUrl = avatar?.vrmUrl ?? "/models/avatar_01.vrm";

  const modelUrl = useMemo(() => {
    const baseUrl = avatarUrl;
    const separator = baseUrl.includes("?") ? "&" : "?";
    const instanceId = encodeURIComponent(sessionId || "local");
    return `${baseUrl}${separator}instance=${instanceId}`;
  }, [avatarUrl, sessionId]);

  const model = useCharacterModelLoader({
    useViverseAvatar: false,
    castShadow: true,
    url: modelUrl,
    type: "vrm",
  });

  const physics = useBvhCharacterPhysics(model.scene);

  useEffect(() => {
    if (!model.scene) return;
    const { position, rotation } = useLocalPlayerStore.getState();
    model.scene.position.copy(position);
    model.scene.rotation.copy(rotation);
  }, [model.scene]);

  usePointerCaptureRotateZoomActionBindings();
  useKeyboardLocomotionActionBindings();

  useFrame((state) => {
    updateSimpleCharacterVelocity(state.camera, physics);
    if (model.scene) {
      model.scene.rotation.y = state.camera.rotation.y;
    }
  });

  const cameraOptions = useMemo<CharacterCameraBehaviorOptions>(() => {
    if (isFPV) {
      return {
        zoom: { minDistance: 0, maxDistance: 0 },
        characterBaseOffset: [0, 1.5, 0] as [number, number, number],
      };
    }

    return {
      zoom: { speed: 500, minDistance: 1.5, maxDistance: 5 },
      characterBaseOffset: [0, 1.5, 0] as [number, number, number],
    };
  }, [isFPV]);

  useCharacterCameraBehavior(model.scene, cameraOptions);
  useCameraController();

  useEffect(() => {
    if (!innerRef || !model.scene) return;

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
