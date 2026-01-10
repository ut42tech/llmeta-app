import { useFrame } from "@react-three/fiber";
import {
  Graph,
  GrapthState,
  RunTimeline,
  Switch,
  SwitchCase,
} from "@react-three/timeline";
import {
  CharacterAnimationAction,
  CharacterAnimationLayer,
} from "@react-three/viverse";
import { useRef } from "react";
import { type AnimationAction, LoopOnce } from "three";
import {
  IdleAnimationUrl,
  JumpDownAnimationUrl,
  JumpLoopAnimationUrl,
  JumpUpAnimationUrl,
  MOVEMENT_ANIMATIONS,
  RUN_TIME_SCALE,
  WALK_TIME_SCALE,
} from "@/constants/animations";
import { useRemotePlayersStore } from "@/stores";
import { boneMap } from "@/utils/bone-map";

export function RemoteCharacterAnimation({ sessionId }: { sessionId: string }) {
  const isRunning = useRemotePlayersStore(
    (s) => s.players[sessionId]?.isRunning ?? false,
  );
  const animation = useRemotePlayersStore(
    (s) => s.players[sessionId]?.animation ?? "idle",
  );

  const forwardRef = useRef<AnimationAction>(null);
  const backwardRef = useRef<AnimationAction>(null);
  const leftRef = useRef<AnimationAction>(null);
  const rightRef = useRef<AnimationAction>(null);
  const forwardRightRef = useRef<AnimationAction>(null);
  const forwardLeftRef = useRef<AnimationAction>(null);
  const backwardRightRef = useRef<AnimationAction>(null);
  const backwardLeftRef = useRef<AnimationAction>(null);
  const idleRef = useRef<AnimationAction>(null);
  const jumpUpRef = useRef<AnimationAction>(null);
  const jumpLoopRef = useRef<AnimationAction>(null);
  const jumpDownRef = useRef<AnimationAction>(null);

  const animationRefs: Record<
    string,
    React.RefObject<AnimationAction | null>
  > = {
    idle: idleRef,
    forward: forwardRef,
    forwardRight: forwardRightRef,
    right: rightRef,
    backwardRight: backwardRightRef,
    backward: backwardRef,
    backwardLeft: backwardLeftRef,
    left: leftRef,
    forwardLeft: forwardLeftRef,
    jumpUp: jumpUpRef,
    jumpLoop: jumpLoopRef,
    jumpDown: jumpDownRef,
  };

  const movementRefs = MOVEMENT_ANIMATIONS.map(
    (anim) => animationRefs[anim.name],
  );

  useFrame(() => {
    const timeScale = isRunning ? RUN_TIME_SCALE : WALK_TIME_SCALE;

    for (const ref of movementRefs) {
      if (ref.current) {
        ref.current.timeScale = timeScale;
      }
    }
  });

  return (
    <RunTimeline>
      <CharacterAnimationLayer name={`remote-character-layer-${sessionId}`}>
        <Graph enterState="move">
          <GrapthState name="move">
            <Switch>
              {MOVEMENT_ANIMATIONS.map((anim, index) => (
                <SwitchCase
                  key={anim.name}
                  index={index}
                  condition={() => animation === anim.name}
                >
                  <CharacterAnimationAction
                    sync
                    scaleTime={anim.scaleTime}
                    boneMap={boneMap}
                    ref={animationRefs[anim.name]}
                    url={anim.url}
                  />
                </SwitchCase>
              ))}
              <SwitchCase
                index={MOVEMENT_ANIMATIONS.length}
                condition={() => animation === "jumpUp"}
              >
                <CharacterAnimationAction
                  loop={LoopOnce}
                  ref={jumpUpRef}
                  url={JumpUpAnimationUrl}
                />
              </SwitchCase>
              <SwitchCase
                index={MOVEMENT_ANIMATIONS.length + 1}
                condition={() => animation === "jumpLoop"}
              >
                <CharacterAnimationAction
                  ref={jumpLoopRef}
                  url={JumpLoopAnimationUrl}
                />
              </SwitchCase>
              <SwitchCase
                index={MOVEMENT_ANIMATIONS.length + 2}
                condition={() => animation === "jumpDown"}
              >
                <CharacterAnimationAction
                  ref={jumpDownRef}
                  loop={LoopOnce}
                  url={JumpDownAnimationUrl}
                />
              </SwitchCase>
              <SwitchCase index={MOVEMENT_ANIMATIONS.length + 3}>
                <CharacterAnimationAction
                  ref={idleRef}
                  url={IdleAnimationUrl}
                />
              </SwitchCase>
            </Switch>
          </GrapthState>
        </Graph>
      </CharacterAnimationLayer>
    </RunTimeline>
  );
}
