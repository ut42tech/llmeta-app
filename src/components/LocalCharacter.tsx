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
import { CharacterAnimation } from "@/components/CharacterAnimation";

export function LocalCharacter() {
  //load model
  const model = useCharacterModelLoader({
    castShadow: true,
    url: "avatar.vrm",
  });

  const physics = useBvhCharacterPhysics(model.scene);

  //action bindings:
  usePointerCaptureRotateZoomActionBindings();
  useKeyboardLocomotionActionBindings();

  //apply the actions to the character physics movement (only movement not jumping) each frame
  useFrame((state) => updateSimpleCharacterVelocity(state.camera, physics));

  //character camera
  useCharacterCameraBehavior(model.scene, {
    zoom: { speed: 0 },
    characterBaseOffset: [0, 1.3, 0],
  });

  //character rotation matches camera rotation on y axis
  useFrame((state) => {
    model.scene.rotation.y = state.camera.rotation.y;
  });

  return (
    <CharacterModelProvider model={model}>
      <CharacterAnimation physics={physics} />
      <primitive object={model.scene} />
    </CharacterModelProvider>
  );
}
