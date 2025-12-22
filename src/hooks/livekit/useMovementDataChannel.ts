/**
 * Hook for movement synchronization via LiveKit DataChannel.
 * This is optimized for high-frequency updates (every frame).
 *
 * Movement data (position, rotation, animation state) requires
 * DataChannel because Participant Attributes have update frequency limits.
 */
import { useCallback } from "react";
import { Euler, Vector3 } from "three";
import { DATA_TOPICS } from "@/constants/sync";
import { useTypedDataChannel } from "@/hooks/livekit/createTypedDataChannel";
import { useRemotePlayersStore } from "@/stores/remotePlayersStore";
import type { AnimationState, MoveData } from "@/types/player";

/**
 * Hook for player movement synchronization via DataChannel
 */
export function useMovementDataChannel(identity: string) {
  const upsertPlayer = useRemotePlayersStore((s) => s.upsertPlayer);

  const handleMove = useCallback(
    (data: MoveData, senderId: string) => {
      upsertPlayer(senderId, {
        position: new Vector3(
          data.position?.x ?? 0,
          data.position?.y ?? 0,
          data.position?.z ?? 0,
        ),
        rotation: new Euler(
          data.rotation?.x ?? 0,
          data.rotation?.y ?? 0,
          data.rotation?.z ?? 0,
        ),
        isRunning: Boolean(data.isRunning),
        animation: (data.animation || "idle") as AnimationState,
      });
    },
    [upsertPlayer],
  );

  const { publish: publishMove } = useTypedDataChannel<MoveData>({
    topic: DATA_TOPICS.MOVE,
    identity,
    onMessage: handleMove,
  });

  const sendMove = useCallback(
    (payload: MoveData) => publishMove(payload, false),
    [publishMove],
  );

  return { sendMove };
}
