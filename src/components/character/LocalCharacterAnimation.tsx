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
  IdleAnimationUrl,
  JumpDownAnimationUrl,
  JumpLoopAnimationUrl,
  JumpUpAnimationUrl,
  RunAction,
  shouldJump,
} from "@react-three/viverse";
import { useRef } from "react";
import { type AnimationAction, LoopOnce, Vector3 } from "three";
import { useMovementDirection } from "@/hooks/useMovementDirection";
import {
  type AnimationState,
  useLocalPlayerStore,
} from "@/stores/localPlayerStore";
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

  const moveAnimations: {
    name: AnimationState;
    condition: () => boolean;
    url: string;
    scaleTime: number;
    ref: React.RefObject<AnimationAction | null>;
  }[] = [
    {
      name: "forward",
      condition: () =>
        Math.abs(normalizedDirection.x) < 0.5 && normalizedDirection.y > 0.5,
      url: "/animations/jog-forward.glb",
      scaleTime: 1.5,
      ref: forwardRef,
    },
    {
      name: "forwardRight",
      condition: () =>
        normalizedDirection.x > 0.5 && normalizedDirection.y > 0.5,
      url: "/animations/jog-forward-right.glb",
      scaleTime: 1.5,
      ref: forwardRightRef,
    },
    {
      name: "right",
      condition: () =>
        normalizedDirection.x > 0.5 && Math.abs(normalizedDirection.y) < 0.5,
      url: "/animations/jog-right.glb",
      scaleTime: 0.9,
      ref: rightRef,
    },
    {
      name: "backwardRight",
      condition: () =>
        normalizedDirection.x > 0.5 && normalizedDirection.y < -0.5,
      url: "/animations/jog-backward-right.glb",
      scaleTime: 1.3,
      ref: backwardRightRef,
    },
    {
      name: "backward",
      condition: () =>
        Math.abs(normalizedDirection.x) < 0.5 && normalizedDirection.y < -0.5,
      url: "/animations/jog-backward.glb",
      scaleTime: 1.4,
      ref: backwardRef,
    },
    {
      name: "backwardLeft",
      condition: () =>
        normalizedDirection.x < -0.5 && normalizedDirection.y < -0.5,
      url: "/animations/jog-backward-left.glb",
      scaleTime: 1.3,
      ref: backwardLeftRef,
    },
    {
      name: "left",
      condition: () =>
        normalizedDirection.x < -0.5 && Math.abs(normalizedDirection.y) < 0.5,
      url: "/animations/jog-left.glb",
      scaleTime: 0.9,
      ref: leftRef,
    },
    {
      name: "forwardLeft",
      condition: () =>
        normalizedDirection.x < -0.5 && normalizedDirection.y > 0.5,
      url: "/animations/jog-forward-left.glb",
      scaleTime: 1.5,
      ref: forwardLeftRef,
    },
  ];

  useFrame(() => {
    const timeScale = RunAction.get() ? 2 : 1;
    setIsRunning(RunAction.get());

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
