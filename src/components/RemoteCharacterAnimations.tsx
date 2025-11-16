"use client";

import { RunTimeline, Switch, SwitchCase } from "@react-three/timeline";
import {
  CharacterAnimationAction,
  CharacterAnimationLayer,
} from "@react-three/viverse";
import {
  IdleAnimationUrl,
  JumpDownAnimationUrl,
  JumpForwardAnimationUrl,
  JumpLoopAnimationUrl,
  JumpUpAnimationUrl,
  RunAnimationUrl,
  WalkAnimationUrl,
} from "@/constants";
import type { AnimationName } from "@/stores/localPlayerStore";

export type RemoteCharacterAnimationsProps = {
  currentAnimation: AnimationName;
};

/**
 * Character animation component for remote players
 * Uses the new CharacterAnimationAction API with Switch/SwitchCase
 */
export const RemoteCharacterAnimations = ({
  currentAnimation,
}: RemoteCharacterAnimationsProps) => {
  return (
    <RunTimeline>
      <CharacterAnimationLayer name="remote-player">
        <Switch>
          <SwitchCase index={0} condition={() => currentAnimation === "idle"}>
            <CharacterAnimationAction url={IdleAnimationUrl} />
          </SwitchCase>
          <SwitchCase index={1} condition={() => currentAnimation === "walk"}>
            <CharacterAnimationAction url={WalkAnimationUrl} scaleTime={0.5} />
          </SwitchCase>
          <SwitchCase index={2} condition={() => currentAnimation === "run"}>
            <CharacterAnimationAction url={RunAnimationUrl} scaleTime={0.8} />
          </SwitchCase>
          <SwitchCase index={3} condition={() => currentAnimation === "jumpUp"}>
            <CharacterAnimationAction url={JumpUpAnimationUrl} />
          </SwitchCase>
          <SwitchCase
            index={4}
            condition={() => currentAnimation === "jumpLoop"}
          >
            <CharacterAnimationAction url={JumpLoopAnimationUrl} />
          </SwitchCase>
          <SwitchCase
            index={5}
            condition={() => currentAnimation === "jumpDown"}
          >
            <CharacterAnimationAction url={JumpDownAnimationUrl} />
          </SwitchCase>
          <SwitchCase
            index={6}
            condition={() => currentAnimation === "jumpForward"}
          >
            <CharacterAnimationAction
              url={JumpForwardAnimationUrl}
              scaleTime={0.9}
            />
          </SwitchCase>
        </Switch>
      </CharacterAnimationLayer>
    </RunTimeline>
  );
};
