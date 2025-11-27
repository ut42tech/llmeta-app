import { useDataChannel } from "@livekit/components-react";
import { useCallback } from "react";
import { Euler, Vector3 } from "three";
import { DATA_TOPICS } from "@/constants/sync";
import { useRemotePlayersStore } from "@/stores/remotePlayersStore";
import type {
  AnimationState,
  MoveData,
  ProfileData,
  ReceivedDataMessage,
} from "@/types";
import { decodePayload, encodePayload } from "@/utils/data-channel";

/**
 * Hook for player synchronization data channels (move + profile)
 */
export function usePlayerDataChannel(identity: string) {
  const upsertPlayer = useRemotePlayersStore((s) => s.upsertPlayer);

  const handleMoveMessage = useCallback(
    (msg: ReceivedDataMessage<typeof DATA_TOPICS.MOVE>) => {
      const remoteId = msg.from?.identity || msg.from?.sid || "";
      if (!remoteId || remoteId === identity) return;

      const data = decodePayload<MoveData>(msg.payload);
      if (!data) return;

      upsertPlayer(remoteId, {
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
    [upsertPlayer, identity],
  );

  const handleProfileMessage = useCallback(
    (msg: ReceivedDataMessage<typeof DATA_TOPICS.PROFILE>) => {
      const remoteId = msg.from?.identity || msg.from?.sid || "";
      if (!remoteId || remoteId === identity) return;

      const data = decodePayload<ProfileData>(msg.payload);
      if (!data) return;

      upsertPlayer(remoteId, {
        username: data.username,
        avatar: data.avatar,
      });
    },
    [upsertPlayer, identity],
  );

  const { send: sendMovePacket } = useDataChannel(
    DATA_TOPICS.MOVE,
    handleMoveMessage,
  );

  const { send: sendProfilePacket } = useDataChannel(
    DATA_TOPICS.PROFILE,
    handleProfileMessage,
  );

  const sendMove = useCallback(
    (payload: MoveData) => {
      sendMovePacket(encodePayload(payload), {
        topic: DATA_TOPICS.MOVE,
        reliable: false,
      }).catch((e) => console.warn("[LiveKit] Failed to publish move", e));
    },
    [sendMovePacket],
  );

  const sendProfile = useCallback(
    (payload: ProfileData) => {
      sendProfilePacket(encodePayload(payload), {
        topic: DATA_TOPICS.PROFILE,
        reliable: true,
      }).catch((e) => console.warn("[LiveKit] Failed to publish profile", e));
    },
    [sendProfilePacket],
  );

  return { sendMove, sendProfile };
}
