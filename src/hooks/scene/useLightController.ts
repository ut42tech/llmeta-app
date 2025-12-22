import { useFrame, useThree } from "@react-three/fiber";
import type { RefObject } from "react";
import { useEffect } from "react";
import { type DirectionalLight, type Object3D, Vector3 } from "three";
import { LIGHTING } from "@/constants/world";

const LIGHT_OFFSET = new Vector3(
  LIGHTING.LIGHT_OFFSET.x,
  LIGHTING.LIGHT_OFFSET.y,
  LIGHTING.LIGHT_OFFSET.z,
);
const tmpVec = new Vector3();

/**
 * Light controller hook
 * Makes directional light follow the character
 */
export function useLightController(
  characterRef: RefObject<Object3D | null>,
  lightRef: RefObject<DirectionalLight | null>,
) {
  const { scene } = useThree();

  useEffect(() => {
    const light = lightRef.current;
    if (!light) return;

    scene.add(light.target);
    return () => {
      scene.remove(light.target);
    };
  }, [scene, lightRef]);

  useFrame(() => {
    const character = characterRef.current;
    const light = lightRef.current;

    if (!character || !light) return;

    light.target.position.copy(character.position);
    tmpVec.copy(light.target.position).add(LIGHT_OFFSET);
    light.position.copy(tmpVec);
  });
}
