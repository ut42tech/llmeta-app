import { useCallback } from "react";
import { Euler, Vector3 } from "three";
import { DATA_TOPICS } from "@/constants/sync";
import { useTypedDataChannel } from "@/hooks/livekit/createTypedDataChannel";
import { useRemotePlayersStore } from "@/stores/remotePlayersStore";
import type { AnimationState, MoveData, ProfileData } from "@/types/player";

/**
 * Hook for player synchronization data channels (move + profile)
 */
export function usePlayerDataChannel(identity: string) {
  const upsertPlayer = useRemotePlayersStore((s) => s.upsertPlayer);

  // Move channel
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

  // Profile channel
  const handleProfile = useCallback(
    (data: ProfileData, senderId: string) => {
      upsertPlayer(senderId, {
        username: data.username,
        avatar: data.avatar,
      });
    },
    [upsertPlayer],
  );

  const { publish: publishProfile } = useTypedDataChannel<ProfileData>({
    topic: DATA_TOPICS.PROFILE,
    identity,
    onMessage: handleProfile,
  });

  const sendMove = useCallback(
    (payload: MoveData) => publishMove(payload, false),
    [publishMove],
  );

  const sendProfile = useCallback(
    (payload: ProfileData) => publishProfile(payload, true),
    [publishProfile],
  );

  return { sendMove, sendProfile };
}
