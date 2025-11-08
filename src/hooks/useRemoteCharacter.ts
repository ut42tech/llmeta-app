import {
  getSimpleCharacterModelAnimationOptions,
  loadCharacterModel,
  loadCharacterModelAnimation,
} from "@pmndrs/viverse";
import { useEffect, useState } from "react";
import type { AnimationAction, AnimationMixer, Group, Object3D } from "three";
import { AnimationMixer as ThreeAnimationMixer } from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import {
  type AnimationName,
  DEFAULT_ANIMATION,
} from "@/stores/localPlayerStore";

const animationNames = [
  "walk",
  "run",
  "idle",
  "jumpUp",
  "jumpLoop",
  "jumpDown",
  "jumpForward",
] as AnimationName[];

type CharacterModelState = {
  mixer: AnimationMixer | null;
  actions: Map<AnimationName, AnimationAction>;
  isLoaded: boolean;
};

const loadAnimations = async (
  model: NonNullable<Awaited<ReturnType<typeof loadCharacterModel>>>,
  mixer: AnimationMixer,
): Promise<Map<AnimationName, AnimationAction>> => {
  const actionsMap = new Map<AnimationName, AnimationAction>();
  const results = await Promise.allSettled(
    animationNames.map(async (name) => {
      try {
        const animOptions = await getSimpleCharacterModelAnimationOptions(name);
        const clip = await loadCharacterModelAnimation(model, animOptions);
        return { name, action: clip ? mixer.clipAction(clip) : null };
      } catch (error) {
        console.warn(`Failed to load animation: ${name}`, error);
        return { name, action: null };
      }
    }),
  );

  results.forEach((result) => {
    if (result.status === "fulfilled" && result.value.action) {
      actionsMap.set(result.value.name, result.value.action);
    }
  });

  return actionsMap;
};

export const useRemoteCharacter = (groupRef: React.RefObject<Group | null>) => {
  const [state, setState] = useState<CharacterModelState>({
    mixer: null,
    actions: new Map(),
    isLoaded: false,
  });

  useEffect(() => {
    let mounted = true;
    let modelScene: Object3D | null = null;

    const setup = async () => {
      const group = groupRef.current;
      if (!group) return;

      try {
        const baseModel = await loadCharacterModel();
        if (!baseModel) throw new Error("Failed to load character model");

        modelScene = SkeletonUtils.clone(baseModel.scene);
        const mixer = new ThreeAnimationMixer(modelScene);
        const actions = await loadAnimations(baseModel, mixer);

        if (!mounted) return;

        group.add(modelScene);
        actions.get(DEFAULT_ANIMATION)?.play();

        setState({ mixer, actions, isLoaded: true });
      } catch (error) {
        console.error("Failed to setup remote character:", error);
      }
    };

    setup();

    return () => {
      mounted = false;
      state.mixer?.stopAllAction();
      if (modelScene) {
        groupRef.current?.remove(modelScene);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupRef]);

  return state;
};
