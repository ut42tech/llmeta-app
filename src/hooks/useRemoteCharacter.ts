import { useEffect, useRef, useState } from "react";
import type { AnimationAction, AnimationMixer, Group } from "three";
import {
  type AnimationName,
  DEFAULT_ANIMATION,
} from "@/stores/localPlayerStore";
import { createRemotePlayerInstance } from "@/utils/remoteCharacterLoader";

type CharacterModelState = {
  mixer: AnimationMixer | null;
  actions: Map<AnimationName, AnimationAction>;
  model: RemotePlayerInstance["model"] | null;
  characterGroup: RemotePlayerInstance["group"] | null; // AnimationMixerのルートグループ
  isLoaded: boolean;
};

type RemotePlayerInstance = Awaited<
  ReturnType<typeof createRemotePlayerInstance>
>;

export const useRemoteCharacter = (groupRef: React.RefObject<Group | null>) => {
  const [state, setState] = useState<CharacterModelState>({
    mixer: null,
    actions: new Map(),
    model: null,
    characterGroup: null,
    isLoaded: false,
  });

  const mixerRef = useRef<AnimationMixer | null>(null);
  const instanceRef = useRef<{
    group: RemotePlayerInstance["group"];
    model: RemotePlayerInstance["model"];
  } | null>(null);

  useEffect(() => {
    let mounted = true;

    const setup = async () => {
      const group = groupRef.current;
      if (!group) return;

      try {
        const instance = await createRemotePlayerInstance();

        if (!mounted) {
          instance.mixer.stopAllAction();
          return;
        }

        instanceRef.current = {
          group: instance.group,
          model: instance.model,
        };

        group.add(instance.group);

        const defaultAction = instance.actions.get(DEFAULT_ANIMATION);
        if (defaultAction) {
          defaultAction.reset();
          defaultAction.play();
        }

        mixerRef.current = instance.mixer;
        setState({
          mixer: instance.mixer,
          actions: instance.actions,
          model: instance.model,
          characterGroup: instance.group,
          isLoaded: true,
        });
      } catch (error) {
        console.error("Failed to setup remote character:", error);
      }
    };

    setup();

    return () => {
      mounted = false;
      if (instanceRef.current) {
        const parentGroup = groupRef.current;
        if (parentGroup) {
          parentGroup.remove(instanceRef.current.group);
        }
        if (mixerRef.current) {
          mixerRef.current.uncacheRoot(instanceRef.current.group);
        }
        instanceRef.current = null;
      }
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
        mixerRef.current = null;
      }
    };
  }, [groupRef]);

  return state;
};
