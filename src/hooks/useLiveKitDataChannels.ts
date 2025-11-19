import { useDataChannel } from "@livekit/components-react";
import type { Participant } from "livekit-client";
import { useCallback } from "react";
import { Euler, Vector3 } from "three";
import { DATA_TOPICS } from "@/constants/sync";
import type { AnimationState } from "@/stores/localPlayerStore";
import { useRemotePlayersStore } from "@/stores/remotePlayersStore";
import type { MoveData, ProfileData } from "@/types/multiplayer";
import { decodePayload } from "@/utils/livekit-client";

const encoder = new TextEncoder();

type ReceivedDataMessage<T extends string> = {
  topic?: T;
  payload: Uint8Array;
  from?: Participant;
};

export function useLiveKitDataChannels(identity: string) {
  const addOrUpdatePlayer = useRemotePlayersStore(
    (state) => state.addOrUpdatePlayer,
  );

  const handleMoveMessage = useCallback(
    (msg: ReceivedDataMessage<typeof DATA_TOPICS.MOVE>) => {
      const remoteIdentity = msg.from?.identity || msg.from?.sid || "";
      if (!remoteIdentity || remoteIdentity === identity) {
        return;
      }

      const data = decodePayload<MoveData>(msg.payload);
      if (!data) {
        return;
      }

      addOrUpdatePlayer(remoteIdentity, {
        sessionId: remoteIdentity,
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
    [addOrUpdatePlayer, identity],
  );

  const handleProfileMessage = useCallback(
    (msg: ReceivedDataMessage<typeof DATA_TOPICS.PROFILE>) => {
      const remoteIdentity = msg.from?.identity || msg.from?.sid || "";
      if (!remoteIdentity || remoteIdentity === identity) {
        return;
      }

      const data = decodePayload<ProfileData>(msg.payload);
      if (!data) {
        return;
      }

      addOrUpdatePlayer(remoteIdentity, {
        sessionId: remoteIdentity,
        username: data.username,
        avatar: data.avatar,
      });
    },
    [addOrUpdatePlayer, identity],
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
      const encoded = encoder.encode(JSON.stringify(payload));
      void sendMovePacket(encoded, {
        topic: DATA_TOPICS.MOVE,
        reliable: false,
      }).catch((error) => {
        console.warn("[LiveKit] Failed to publish move", error);
      });
    },
    [sendMovePacket],
  );

  const sendProfile = useCallback(
    (payload: ProfileData) => {
      const encoded = encoder.encode(JSON.stringify(payload));
      void sendProfilePacket(encoded, {
        topic: DATA_TOPICS.PROFILE,
        reliable: true,
      }).catch((error) => {
        console.warn("[LiveKit] Failed to publish profile", error);
      });
    },
    [sendProfilePacket],
  );

  return { sendMove, sendProfile };
}
