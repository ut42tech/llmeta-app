import { useEffect, useRef } from "react";
import type { AnimationAction, AnimationMixer } from "three";
import { PERFORMANCE } from "@/constants";
import type { AnimationName } from "@/stores/localPlayerStore";

type UseAnimationControllerParams = {
  animation: AnimationName;
  mixer: AnimationMixer | null;
  actions: Map<AnimationName, AnimationAction>;
  isModelLoaded: boolean;
};

const FADE_DURATION = PERFORMANCE.ANIMATION_FADE_DURATION;

export const useRemoteCharacterAnimation = ({
  animation,
  mixer,
  actions,
  isModelLoaded,
}: UseAnimationControllerParams) => {
  const currentActionRef = useRef<AnimationAction | null>(null);

  useEffect(() => {
    if (!mixer || !actions.size || !isModelLoaded) return;

    const nextAction = actions.get(animation);
    if (!nextAction || nextAction === currentActionRef.current) return;

    const currentAction = currentActionRef.current;

    currentAction?.fadeOut(FADE_DURATION);
    nextAction.reset();
    nextAction.play();
    nextAction.fadeIn(FADE_DURATION);

    currentActionRef.current = nextAction;
  }, [animation, mixer, actions, isModelLoaded]);

  return currentActionRef;
};
