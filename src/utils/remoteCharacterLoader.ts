import {
  preloadSimpleCharacterAssets,
  simpleCharacterAnimationNames,
} from "@pmndrs/viverse";
import type { AnimationAction } from "three";
import { AnimationMixer, Group, LoopOnce } from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import type { AnimationName } from "@/stores/localPlayerStore";

type SharedAssets = Awaited<ReturnType<typeof preloadSimpleCharacterAssets>>;

let sharedAssetsPromise: Promise<SharedAssets> | null = null;

const ensureSharedAssets = async () => {
  if (!sharedAssetsPromise) {
    const preload = preloadSimpleCharacterAssets({
      model: true,
      animation: {},
    });

    sharedAssetsPromise = preload.catch((error) => {
      sharedAssetsPromise = null;
      throw error;
    });
  }

  return sharedAssetsPromise;
};

export const getSharedCharacterAssets = async () => {
  const assets = await ensureSharedAssets();

  if (!assets.model) {
    throw new Error("[RemoteCharacterLoader] Failed to load shared model");
  }

  return assets;
};

export const createRemotePlayerInstance = async () => {
  const { model, animations } = await getSharedCharacterAssets();

  const group = new Group();
  group.name = "RemotePlayerRoot";

  const modelScene = SkeletonUtils.clone(model.scene);
  group.add(modelScene);

  const mixer = new AnimationMixer(group);
  const actions = new Map<AnimationName, AnimationAction>();

  const animationNames =
    simpleCharacterAnimationNames as readonly AnimationName[];

  for (const name of animationNames) {
    const clip = animations?.[name];
    if (!clip) {
      continue;
    }

    const action = mixer.clipAction(clip);

    if (name === "jumpDown" || name === "jumpUp" || name === "jumpForward") {
      action.setLoop(LoopOnce, 1);
      action.clampWhenFinished = true;
    }

    actions.set(name, action);
  }

  return { group, mixer, actions, model };
};
