import { useDataChannel } from "@livekit/components-react";
import { nanoid } from "nanoid";
import { useCallback } from "react";
import { Euler, Vector3 } from "three";
import { useShallow } from "zustand/react/shallow";
import { DATA_TOPICS } from "@/constants/sync";
import { useChatStore } from "@/stores/chatStore";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";
import { useRemotePlayersStore } from "@/stores/remotePlayersStore";
import type {
  AnimationState,
  ChatMessageImage,
  ChatMessagePacket,
  MoveData,
  ProfileData,
  ReceivedDataMessage,
  TypingPacket,
} from "@/types";
import { decodePayload, encodePayload } from "@/utils/data-channel";

/**
 * Hook to manage all LiveKit data channels
 */
export function useLiveKitDataChannels(identity: string) {
  const upsertPlayer = useRemotePlayersStore((s) => s.upsertPlayer);

  const { localSessionId, username } = useLocalPlayerStore(
    useShallow((s) => ({ localSessionId: s.sessionId, username: s.username })),
  );

  const {
    addIncomingMessage,
    addOutgoingMessage,
    updateMessageStatus,
    addTypingUser,
    removeTypingUser,
  } = useChatStore(
    useShallow((s) => ({
      addIncomingMessage: s.addIncomingMessage,
      addOutgoingMessage: s.addOutgoingMessage,
      updateMessageStatus: s.updateMessageStatus,
      addTypingUser: s.addTypingUser,
      removeTypingUser: s.removeTypingUser,
    })),
  );

  // Message handlers
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

  const handleChatMessage = useCallback(
    (msg: ReceivedDataMessage<typeof DATA_TOPICS.CHAT_MESSAGE>) => {
      const remoteId = msg.from?.identity || msg.from?.sid || "";
      const localId = localSessionId || identity;
      if (!remoteId || remoteId === localId) return;

      const data = decodePayload<ChatMessagePacket>(msg.payload);
      if (!data?.text && !data?.image) return;

      addIncomingMessage({
        id: data.id,
        sessionId: remoteId,
        username: data.username,
        content: data.text,
        sentAt: data.sentAt ?? Date.now(),
        image: data.image,
      });
    },
    [addIncomingMessage, identity, localSessionId],
  );

  const handleTypingMessage = useCallback(
    (msg: ReceivedDataMessage<typeof DATA_TOPICS.TYPING>) => {
      const remoteId = msg.from?.identity || msg.from?.sid || "";
      const localId = localSessionId || identity;
      if (!remoteId || remoteId === localId) return;

      const data = decodePayload<TypingPacket>(msg.payload);
      if (!data) return;

      if (data.isTyping) {
        addTypingUser(remoteId, data.username);
      } else {
        removeTypingUser(remoteId);
      }
    },
    [addTypingUser, identity, localSessionId, removeTypingUser],
  );

  // Data channel hooks
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

  // Send functions
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

  const sendChatMessage = useCallback(
    async (content: string, image?: ChatMessageImage) => {
      const text = content.trim();
      if (!text && !image) return;

      const messageId = nanoid();
      const payload: ChatMessagePacket = {
        id: messageId,
        text,
        username: username || undefined,
        sentAt: Date.now(),
        image,
      };

      addOutgoingMessage({
        id: payload.id,
        sessionId: localSessionId || identity,
        username: payload.username,
        content: payload.text,
        sentAt: payload.sentAt,
        image: payload.image,
      });

      try {
        await sendChatPacket(encodePayload(payload), {
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
      sendTypingPacket(encodePayload(payload), {
        topic: DATA_TOPICS.TYPING,
        reliable: false,
      }).catch((e) => console.warn("[LiveKit] Failed to publish typing", e));
    },
    [sendTypingPacket, username],
  );

  return { sendMove, sendProfile, sendChatMessage, sendTyping };
}
