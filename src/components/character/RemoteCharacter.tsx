import { useFrame } from "@react-three/fiber";
import {
  CharacterModelProvider,
  useCharacterModelLoader,
} from "@react-three/viverse";
import {
  type RemoteTrack,
  type RemoteTrackPublication,
  Track,
  type TrackPublication,
} from "livekit-client";
import { useEffect, useMemo } from "react";
import { PlayerTag } from "@/components/character/PlayerTag";
import { RemoteCharacterAnimation } from "@/components/character/RemoteCharacterAnimation";
import { TextChatBubble } from "@/components/character/TextChatBubble";
import { useSyncClient } from "@/hooks/livekit/useSyncClient";
import {
  usePositionBuffer,
  useRotationBuffer,
} from "@/hooks/scene/useSnapshotBuffer";
import { useRemotePlayersStore } from "@/stores/remotePlayersStore";

export function RemoteCharacter({ sessionId }: { sessionId: string }) {
  const player = useRemotePlayersStore((s) => s.players[sessionId]);
  const setPlayerMuteStatus = useRemotePlayersStore(
    (s) => s.setPlayerMuteStatus,
  );
  const setPlayerSpeakingStatus = useRemotePlayersStore(
    (s) => s.setPlayerSpeakingStatus,
  );
  const { room } = useSyncClient();

  const avatarUrl = player?.avatar?.vrmUrl;
  const modelUrl = useMemo(() => {
    const baseUrl =
      avatarUrl && avatarUrl.trim().length > 0
        ? avatarUrl
        : "/models/avatar_01.vrm";
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}instance=${encodeURIComponent(sessionId)}`;
  }, [avatarUrl, sessionId]);

  const model = useCharacterModelLoader({
    useViverseAvatar: false,
    castShadow: true,
    url: modelUrl,
    type: "vrm",
  });

  const smoothPosition = usePositionBuffer(
    player?.position ?? model.scene.position,
  );
  const smoothRotation = useRotationBuffer(
    player?.rotation ?? model.scene.rotation,
  );

  useFrame(() => {
    if (!player || !model.scene) return;

    model.scene.position.copy(smoothPosition);
    model.scene.quaternion.copy(smoothRotation);
  });

  useEffect(() => {
    if (!room) return;

    const participant = room.remoteParticipants.get(sessionId);
    if (!participant) {
      setPlayerMuteStatus(sessionId, true);
      setPlayerSpeakingStatus(sessionId, false);
      return;
    }

    const updateMuteStatus = () => {
      const audioPublication = participant.getTrackPublication(
        Track.Source.Microphone,
      );
      const isMuted =
        !audioPublication ||
        audioPublication.isMuted ||
        !audioPublication.isSubscribed;
      setPlayerMuteStatus(sessionId, isMuted);
    };

    updateMuteStatus();
    setPlayerSpeakingStatus(sessionId, participant.isSpeaking);

    const handleSpeakingChanged = (speaking: boolean) => {
      setPlayerSpeakingStatus(sessionId, speaking);
    };

    const onTrackMuted = (publication: TrackPublication) => {
      if (publication.source === Track.Source.Microphone) {
        updateMuteStatus();
      }
    };

    const onTrackUnmuted = (publication: TrackPublication) => {
      if (publication.source === Track.Source.Microphone) {
        updateMuteStatus();
      }
    };

    const onTrackPublished = (publication: RemoteTrackPublication) => {
      if (publication.source === Track.Source.Microphone) {
        updateMuteStatus();
      }
    };

    const onTrackUnpublished = (publication: RemoteTrackPublication) => {
      if (publication.source === Track.Source.Microphone) {
        setPlayerMuteStatus(sessionId, true);
      }
    };

    const onTrackSubscribed = (
      _track: RemoteTrack,
      publication: RemoteTrackPublication,
    ) => {
      if (publication.source === Track.Source.Microphone) {
        updateMuteStatus();
      }
    };

    const onTrackUnsubscribed = (
      _track: RemoteTrack,
      publication: RemoteTrackPublication,
    ) => {
      if (publication.source === Track.Source.Microphone) {
        updateMuteStatus();
      }
    };

    participant.on("trackMuted", onTrackMuted);
    participant.on("trackUnmuted", onTrackUnmuted);
    participant.on("trackPublished", onTrackPublished);
    participant.on("trackUnpublished", onTrackUnpublished);
    participant.on("trackSubscribed", onTrackSubscribed);
    participant.on("trackUnsubscribed", onTrackUnsubscribed);
    participant.on("isSpeakingChanged", handleSpeakingChanged);

    return () => {
      participant.off("trackMuted", onTrackMuted);
      participant.off("trackUnmuted", onTrackUnmuted);
      participant.off("trackPublished", onTrackPublished);
      participant.off("trackUnpublished", onTrackUnpublished);
      participant.off("trackSubscribed", onTrackSubscribed);
      participant.off("trackUnsubscribed", onTrackUnsubscribed);
      participant.off("isSpeakingChanged", handleSpeakingChanged);
    };
  }, [room, sessionId, setPlayerMuteStatus, setPlayerSpeakingStatus]);

  if (!player) return null;

  return (
    <CharacterModelProvider model={model}>
      <RemoteCharacterAnimation sessionId={sessionId} />
      <primitive object={model.scene}>
        <PlayerTag
          displayName={player.username}
          isMuted={player.isMuted}
          isSpeaking={player.isSpeaking}
        />
        <TextChatBubble sessionId={sessionId} />
      </primitive>
    </CharacterModelProvider>
  );
}
