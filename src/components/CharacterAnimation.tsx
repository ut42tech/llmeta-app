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
  MoveBackwardAction,
  MoveForwardAction,
  MoveLeftAction,
  MoveRightAction,
  RunAction,
  shouldJump,
} from "@react-three/viverse";
import { useMemo, useRef } from "react";
import { type AnimationAction, LoopOnce, Vector2, Vector3 } from "three";
import { boneMap } from "@/utils/bone-map";

export function CharacterAnimation({
  physics,
}: {
  physics: BvhCharacterPhysics;
}) {
  const normalizedDirection = useMemo(() => new Vector2(), []);
  useFrame(() =>
    normalizedDirection
      .set(
        MoveRightAction.get() - MoveLeftAction.get(),
        MoveForwardAction.get() - MoveBackwardAction.get(),
      )
      .normalize(),
  );

  const forwardRef = useRef<AnimationAction>(null);
  const backwardRef = useRef<AnimationAction>(null);
  const leftRef = useRef<AnimationAction>(null);
  const rightRef = useRef<AnimationAction>(null);
  const forwardRightRef = useRef<AnimationAction>(null);
  const forwardLeftRef = useRef<AnimationAction>(null);
  const backwardRightRef = useRef<AnimationAction>(null);
  const backwardLeftRef = useRef<AnimationAction>(null);

  useFrame(() => {
    const timeScale = RunAction.get() ? 2 : 1;
    if (forwardRef.current) {
      forwardRef.current.timeScale = timeScale;
    }
    if (backwardRef.current) {
      backwardRef.current.timeScale = timeScale;
    }
    if (leftRef.current) {
      leftRef.current.timeScale = timeScale;
    }
    if (rightRef.current) {
      rightRef.current.timeScale = timeScale;
    }
    if (forwardRightRef.current) {
      forwardRightRef.current.timeScale = timeScale;
    }
    if (forwardLeftRef.current) {
      forwardLeftRef.current.timeScale = timeScale;
    }
    if (backwardRightRef.current) {
      backwardRightRef.current.timeScale = timeScale;
    }
    if (backwardLeftRef.current) {
      backwardLeftRef.current.timeScale = timeScale;
    }
  });

  const lastJumpTimeRef = useRef(0);
  return (
    <RunTimeline>
      <CharacterAnimationLayer name="base-layer">
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
              <SwitchCase
                index={0}
                condition={() =>
                  Math.abs(normalizedDirection.x) < 0.5 &&
                  normalizedDirection.y > 0.5
                }
              >
                <CharacterAnimationAction
                  sync
                  scaleTime={1.5}
                  boneMap={boneMap}
                  ref={forwardRef}
                  url="jog-forward.glb"
                />
              </SwitchCase>
              <SwitchCase
                index={1}
                condition={() =>
                  normalizedDirection.x > 0.5 && normalizedDirection.y > 0.5
                }
              >
                <CharacterAnimationAction
                  sync
                  scaleTime={1.5}
                  boneMap={boneMap}
                  ref={forwardRightRef}
                  url="jog-forward-right.glb"
                />
              </SwitchCase>
              <SwitchCase
                index={2}
                condition={() =>
                  normalizedDirection.x > 0.5 &&
                  Math.abs(normalizedDirection.y) < 0.5
                }
              >
                <CharacterAnimationAction
                  sync
                  scaleTime={0.9}
                  boneMap={boneMap}
                  ref={rightRef}
                  url="jog-right.glb"
                />
              </SwitchCase>
              <SwitchCase
                index={3}
                condition={() =>
                  normalizedDirection.x > 0.5 && normalizedDirection.y < -0.5
                }
              >
                <CharacterAnimationAction
                  sync
                  scaleTime={1.3}
                  boneMap={boneMap}
                  ref={backwardRightRef}
                  url="jog-backward-right.glb"
                />
              </SwitchCase>
              <SwitchCase
                index={4}
                condition={() =>
                  Math.abs(normalizedDirection.x) < 0.5 &&
                  normalizedDirection.y < -0.5
                }
              >
                <CharacterAnimationAction
                  sync
                  scaleTime={1.4}
                  boneMap={boneMap}
                  ref={backwardRef}
                  url="jog-backward.glb"
                />
              </SwitchCase>
              <SwitchCase
                index={5}
                condition={() =>
                  normalizedDirection.x < -0.5 && normalizedDirection.y < -0.5
                }
              >
                <CharacterAnimationAction
                  sync
                  scaleTime={1.3}
                  boneMap={boneMap}
                  ref={backwardLeftRef}
                  url="jog-backward-left.glb"
                />
              </SwitchCase>
              <SwitchCase
                index={6}
                condition={() =>
                  normalizedDirection.x < -0.5 &&
                  Math.abs(normalizedDirection.y) < 0.5
                }
              >
                <CharacterAnimationAction
                  sync
                  scaleTime={0.9}
                  boneMap={boneMap}
                  ref={leftRef}
                  url="jog-left.glb"
                />
              </SwitchCase>
              <SwitchCase
                index={7}
                condition={() =>
                  normalizedDirection.x < -0.5 && normalizedDirection.y > 0.5
                }
              >
                <CharacterAnimationAction
                  sync
                  scaleTime={1.5}
                  boneMap={boneMap}
                  ref={forwardLeftRef}
                  url="jog-forward-left.glb"
                />
              </SwitchCase>
              <SwitchCase index={8}>
                <CharacterAnimationAction url={IdleAnimationUrl} />
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
              url={JumpUpAnimationUrl}
            />
          </GrapthState>
          <GrapthState
            name="jumpLoop"
            transitionTo={{
              jumpDown: { whenUpdate: () => physics.isGrounded },
            }}
          >
            <CharacterAnimationAction url={JumpLoopAnimationUrl} />
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
              }}
              url={JumpUpAnimationUrl}
            />
          </GrapthState>
          <GrapthState name="jumpDown" transitionTo={{ finally: "move" }}>
            <CharacterAnimationAction
              until={() => timePassed(150, "milliseconds")}
              loop={LoopOnce}
              url={JumpDownAnimationUrl}
            />
          </GrapthState>
        </Graph>
      </CharacterAnimationLayer>
    </RunTimeline>
  );
}
