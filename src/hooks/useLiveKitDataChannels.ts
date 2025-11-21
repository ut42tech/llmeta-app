import { useDataChannel } from "@livekit/components-react";
import type { Participant } from "livekit-client";
import { nanoid } from "nanoid";
import { useCallback } from "react";
import { Euler, Vector3 } from "three";
import { DATA_TOPICS } from "@/constants/sync";
import { useChatStore } from "@/stores/chatStore";
import type { AnimationState } from "@/stores/localPlayerStore";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";
import { useRemotePlayersStore } from "@/stores/remotePlayersStore";
import type { ChatMessagePacket, TypingPacket } from "@/types/chat";
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
  const localSessionId = useLocalPlayerStore((state) => state.sessionId);
  const username = useLocalPlayerStore((state) => state.username);
  const addIncomingMessage = useChatStore((state) => state.addIncomingMessage);
  const addOutgoingMessage = useChatStore((state) => state.addOutgoingMessage);
  const updateMessageStatus = useChatStore(
    (state) => state.updateMessageStatus,
  );
  const addTypingUser = useChatStore((state) => state.addTypingUser);
  const removeTypingUser = useChatStore((state) => state.removeTypingUser);

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

  const handleChatMessage = useCallback(
    (msg: ReceivedDataMessage<typeof DATA_TOPICS.CHAT_MESSAGE>) => {
      const remoteIdentity = msg.from?.identity || msg.from?.sid || "";
      const localIdentity = localSessionId || identity;
      if (!remoteIdentity || remoteIdentity === localIdentity) {
        return;
      }

      const data = decodePayload<ChatMessagePacket>(msg.payload);
      if (!data || !data.text) {
        return;
      }

      addIncomingMessage({
        id: data.id,
        sessionId: remoteIdentity,
        username: data.username,
        content: data.text,
        sentAt: data.sentAt ?? Date.now(),
      });
    },
    [addIncomingMessage, identity, localSessionId],
  );

  const handleTypingMessage = useCallback(
    (msg: ReceivedDataMessage<typeof DATA_TOPICS.TYPING>) => {
      const remoteIdentity = msg.from?.identity || msg.from?.sid || "";
      const localIdentity = localSessionId || identity;
      if (!remoteIdentity || remoteIdentity === localIdentity) {
        return;
      }

      const data = decodePayload<TypingPacket>(msg.payload);
      if (!data) {
        return;
      }

      if (data.isTyping) {
        addTypingUser(remoteIdentity, data.username);
      } else {
        removeTypingUser(remoteIdentity);
      }
    },
    [addTypingUser, identity, localSessionId, removeTypingUser],
  );

  const { send: sendMovePacket } = useDataChannel(
    DATA_TOPICS.MOVE,
    handleMoveMessage,
  );
  const { send: sendProfilePacket } = useDataChannel(
    DATA_TOPICS.PROFILE,
    handleProfileMessage,
  );
  const { send: sendChatPacket } = useDataChannel(
    DATA_TOPICS.CHAT_MESSAGE,
    handleChatMessage,
  );
  const { send: sendTypingPacket } = useDataChannel(
    DATA_TOPICS.TYPING,
    handleTypingMessage,
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

  const sendChatMessage = useCallback(
    async (content: string) => {
      const text = content.trim();
      if (!text) {
        return;
      }

      const messageId = nanoid();
      const payload: ChatMessagePacket = {
        id: messageId,
        text,
        username: username || undefined,
        sentAt: Date.now(),
      };

      addOutgoingMessage({
        id: payload.id,
        sessionId: localSessionId || identity,
        username: payload.username,
        content: payload.text,
        sentAt: payload.sentAt,
      });

      const encoded = encoder.encode(JSON.stringify(payload));
      try {
        await sendChatPacket(encoded, {
          topic: DATA_TOPICS.CHAT_MESSAGE,
          reliable: true,
        });
        updateMessageStatus(messageId, "sent");
      } catch (error) {
        console.warn("[LiveKit] Failed to publish chat message", error);
        updateMessageStatus(messageId, "failed");
      }
    },
    [
      addOutgoingMessage,
      identity,
      localSessionId,
      sendChatPacket,
      updateMessageStatus,
      username,
    ],
  );

  const sendTyping = useCallback(
    (isTyping: boolean) => {
      const payload: TypingPacket = {
        username: username || undefined,
        isTyping,
      };

      const encoded = encoder.encode(JSON.stringify(payload));
      void sendTypingPacket(encoded, {
        topic: DATA_TOPICS.TYPING,
        reliable: false,
      }).catch((error) => {
        console.warn("[LiveKit] Failed to publish typing status", error);
      });
    },
    [sendTypingPacket, username],
  );

  return { sendMove, sendProfile, sendChatMessage, sendTyping };
}
