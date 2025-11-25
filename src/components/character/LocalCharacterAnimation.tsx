import { useFrame } from "@react-three/fiber";
import {
  Graph,
  GrapthState,
  RunTimeline,
  Switch,
  SwitchCase,
  timePassed,
} from "@react-three/timeline";
import {
  type BvhCharacterPhysics,
  CharacterAnimationAction,
  CharacterAnimationLayer,
  RunAction,
  shouldJump,
} from "@react-three/viverse";
import { useRef } from "react";
import { type AnimationAction, LoopOnce, Vector3 } from "three";
import {
  IdleAnimationUrl,
  JumpDownAnimationUrl,
  JumpLoopAnimationUrl,
  JumpUpAnimationUrl,
  MOVEMENT_ANIMATIONS,
  RUN_TIME_SCALE,
  WALK_TIME_SCALE,
} from "@/constants/animations";
import { useMovementDirection } from "@/hooks/useMovementDirection";
import type { AnimationState } from "@/stores/localPlayerStore";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";
import { boneMap } from "@/utils/bone-map";

export function LocalCharacterAnimation({
  physics,
}: {
  physics: BvhCharacterPhysics;
}) {
  const normalizedDirection = useMovementDirection();
  const setAnimation = useLocalPlayerStore((state) => state.setAnimation);
  const setIsRunning = useLocalPlayerStore((state) => state.setIsRunning);

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

  // Map animation names to refs for easy lookup
  const animationRefs: Record<
    AnimationState,
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

  // Build move animations with conditions based on normalized direction
  const moveAnimations = MOVEMENT_ANIMATIONS.map((anim) => ({
    ...anim,
    ref: animationRefs[anim.name],
    condition: (): boolean => {
      const { x, y } = normalizedDirection;
      switch (anim.name) {
        case "forward":
          return Math.abs(x) < 0.5 && y > 0.5;
        case "forwardRight":
          return x > 0.5 && y > 0.5;
        case "right":
          return x > 0.5 && Math.abs(y) < 0.5;
        case "backwardRight":
          return x > 0.5 && y < -0.5;
        case "backward":
          return Math.abs(x) < 0.5 && y < -0.5;
        case "backwardLeft":
          return x < -0.5 && y < -0.5;
        case "left":
          return x < -0.5 && Math.abs(y) < 0.5;
        case "forwardLeft":
          return x < -0.5 && y > 0.5;
        default:
          return false;
      }
    },
  }));

  useFrame(() => {
    const isRunning = RunAction.get();
    const timeScale = isRunning ? RUN_TIME_SCALE : WALK_TIME_SCALE;
    setIsRunning(isRunning);

    for (const anim of moveAnimations) {
      if (anim.ref.current) {
        anim.ref.current.timeScale = timeScale;
      }
    }
  });

  const lastJumpTimeRef = useRef(0);

  return (
    <RunTimeline>
      <CharacterAnimationLayer name="local-character-layer">
        <Graph enterState="move">
          <GrapthState
            name="move"
            transitionTo={{
              jumpStart: {
                whenUpdate: () => shouldJump(physics, lastJumpTimeRef.current),
              },
              jumpLoop: { whenUpdate: () => !physics.isGrounded },
            }}
          >
            <Switch>
              {moveAnimations.map((anim, index) => (
                <SwitchCase
                  key={anim.name}
                  index={index}
                  condition={anim.condition}
                >
                  <CharacterAnimationAction
                    sync
                    scaleTime={anim.scaleTime}
                    boneMap={boneMap}
                    ref={anim.ref}
                    init={() => setAnimation(anim.name)}
                    url={anim.url}
                  />
                </SwitchCase>
              ))}
              <SwitchCase index={8}>
                <CharacterAnimationAction
                  ref={idleRef}
                  init={() => setAnimation("idle")}
                  url={IdleAnimationUrl}
                />
              </SwitchCase>
            </Switch>
          </GrapthState>
          <GrapthState
            name="jumpStart"
            transitionTo={{
              jumpDown: { whenUpdate: () => !physics.isGrounded },
              finally: "jumpUp",
            }}
          >
            <CharacterAnimationAction
              until={() => timePassed(0.2, "seconds")}
              update={() => void physics.inputVelocity.multiplyScalar(0.3)}
              paused
              ref={jumpUpRef}
              init={() => setAnimation("jumpUp")}
              url={JumpUpAnimationUrl}
            />
          </GrapthState>
          <GrapthState
            name="jumpLoop"
            transitionTo={{
              jumpDown: { whenUpdate: () => physics.isGrounded },
            }}
          >
            <CharacterAnimationAction
              ref={jumpLoopRef}
              init={() => setAnimation("jumpLoop")}
              url={JumpLoopAnimationUrl}
            />
          </GrapthState>
          <GrapthState
            name="jumpUp"
            transitionTo={{
              jumpDown: {
                whenUpdate: (_, _clock, actionTime) =>
                  actionTime > 0.3 && physics.isGrounded,
              },
              finally: "jumpLoop",
            }}
          >
            <CharacterAnimationAction
              loop={LoopOnce}
              init={() => {
                lastJumpTimeRef.current = performance.now() / 1000;
                physics.applyVelocity(new Vector3(0, 8, 0));
                setAnimation("jumpUp");
              }}
              ref={jumpUpRef}
              url={JumpUpAnimationUrl}
            />
          </GrapthState>
          <GrapthState name="jumpDown" transitionTo={{ finally: "move" }}>
            <CharacterAnimationAction
              ref={jumpDownRef}
              until={() => timePassed(150, "milliseconds")}
              loop={LoopOnce}
              init={() => setAnimation("jumpDown")}
              url={JumpDownAnimationUrl}
            />
          </GrapthState>
        </Graph>
      </CharacterAnimationLayer>
    </RunTimeline>
  );
}
