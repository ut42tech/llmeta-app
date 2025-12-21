import { useRoomContext } from "@livekit/components-react";
import { useCallback } from "react";
import { Euler, Vector3 } from "three";
import { DATA_TOPICS } from "@/constants/sync";
import { useTypedDataChannel } from "@/hooks/livekit/createTypedDataChannel";
import { useRemotePlayersStore } from "@/stores/remotePlayersStore";
import type { AnimationState, MoveData, ProfileData } from "@/types/player";

/**
 * Hook for player synchronization data channels (move only)
 * Profile sync is handled via Participant Attributes
 */
export function usePlayerDataChannel(identity: string) {
  const room = useRoomContext();
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

  const sendMove = useCallback(
    (payload: MoveData) => publishMove(payload, false),
    [publishMove],
  );

  /**
   * Update local participant's profile via Participant Attributes.
   * This data is automatically synced to all participants by LiveKit.
   */
  const sendProfile = useCallback(
    (payload: ProfileData) => {
      const attributes: Record<string, string> = {};
      if (payload.username !== undefined) {
        attributes.username = payload.username || "";
      }
      if (payload.avatar !== undefined) {
        attributes.avatar = JSON.stringify(payload.avatar);
      }
      room.localParticipant.setAttributes(attributes).catch((e) => {
        console.warn("[PlayerDataChannel] Failed to set attributes", e);
      });
    },
    [room],
  );

  return { sendMove, sendProfile };
}
