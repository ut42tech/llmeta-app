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
  IdleAnimationUrl,
  JumpDownAnimationUrl,
  JumpLoopAnimationUrl,
  JumpUpAnimationUrl,
} from "@react-three/viverse";
import { useRef } from "react";
import { type AnimationAction, LoopOnce } from "three";
import { useRemotePlayersStore } from "@/stores/remotePlayersStore";
import { boneMap } from "@/utils/bone-map";

export function RemoteCharacterAnimation({ sessionId }: { sessionId: string }) {
  const isRunning = useRemotePlayersStore(
    (state) => state.players.get(sessionId)?.isRunning ?? false,
  );
  const animation = useRemotePlayersStore(
    (state) => state.players.get(sessionId)?.animation ?? "idle",
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

  useFrame(() => {
    const timeScale = isRunning ? 2 : 1;

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

  return (
    <RunTimeline>
      <CharacterAnimationLayer name={`remote-character-layer-${sessionId}`}>
        <Graph enterState="move">
          <GrapthState name="move">
            <Switch>
              <SwitchCase index={0} condition={() => animation === "forward"}>
                <CharacterAnimationAction
                  sync
                  scaleTime={1.5}
                  boneMap={boneMap}
                  ref={forwardRef}
                  url="/animations/jog-forward.glb"
                />
              </SwitchCase>
              <SwitchCase
                index={1}
                condition={() => animation === "forwardRight"}
              >
                <CharacterAnimationAction
                  sync
                  scaleTime={1.5}
                  boneMap={boneMap}
                  ref={forwardRightRef}
                  url="/animations/jog-forward-right.glb"
                />
              </SwitchCase>
              <SwitchCase index={2} condition={() => animation === "right"}>
                <CharacterAnimationAction
                  sync
                  scaleTime={0.9}
                  boneMap={boneMap}
                  ref={rightRef}
                  url="/animations/jog-right.glb"
                />
              </SwitchCase>
              <SwitchCase
                index={3}
                condition={() => animation === "backwardRight"}
              >
                <CharacterAnimationAction
                  sync
                  scaleTime={1.3}
                  boneMap={boneMap}
                  ref={backwardRightRef}
                  url="/animations/jog-backward-right.glb"
                />
              </SwitchCase>
              <SwitchCase index={4} condition={() => animation === "backward"}>
                <CharacterAnimationAction
                  sync
                  scaleTime={1.4}
                  boneMap={boneMap}
                  ref={backwardRef}
                  url="/animations/jog-backward.glb"
                />
              </SwitchCase>
              <SwitchCase
                index={5}
                condition={() => animation === "backwardLeft"}
              >
                <CharacterAnimationAction
                  sync
                  scaleTime={1.3}
                  boneMap={boneMap}
                  ref={backwardLeftRef}
                  url="/animations/jog-backward-left.glb"
                />
              </SwitchCase>
              <SwitchCase index={6} condition={() => animation === "left"}>
                <CharacterAnimationAction
                  sync
                  scaleTime={0.9}
                  boneMap={boneMap}
                  ref={leftRef}
                  url="/animations/jog-left.glb"
                />
              </SwitchCase>
              <SwitchCase
                index={7}
                condition={() => animation === "forwardLeft"}
              >
                <CharacterAnimationAction
                  sync
                  scaleTime={1.5}
                  boneMap={boneMap}
                  ref={forwardLeftRef}
                  url="/animations/jog-forward-left.glb"
                />
              </SwitchCase>
              <SwitchCase index={8} condition={() => animation === "jumpUp"}>
                <CharacterAnimationAction
                  loop={LoopOnce}
                  ref={jumpUpRef}
                  url={JumpUpAnimationUrl}
                />
              </SwitchCase>
              <SwitchCase index={9} condition={() => animation === "jumpLoop"}>
                <CharacterAnimationAction
                  ref={jumpLoopRef}
                  url={JumpLoopAnimationUrl}
                />
              </SwitchCase>
              <SwitchCase index={10} condition={() => animation === "jumpDown"}>
                <CharacterAnimationAction
                  ref={jumpDownRef}
                  loop={LoopOnce}
                  url={JumpDownAnimationUrl}
                />
              </SwitchCase>
              <SwitchCase index={11}>
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
