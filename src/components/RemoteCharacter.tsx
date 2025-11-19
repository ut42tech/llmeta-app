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
import { PlayerTag } from "@/components/PlayerTag";
import { RemoteCharacterAnimation } from "@/components/RemoteCharacterAnimation";
import {
  usePositionBuffer,
  useRotationBuffer,
} from "@/hooks/useSnapshotBuffer";
import { useSyncClient } from "@/hooks/useSyncClient";
import { useRemotePlayersStore } from "@/stores/remotePlayersStore";

export function RemoteCharacter({ sessionId }: { sessionId: string }) {
  const player = useRemotePlayersStore((state) => state.players.get(sessionId));
  const setPlayerMuteStatus = useRemotePlayersStore(
    (state) => state.setPlayerMuteStatus,
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
      return;
    }

    const updateMuteStatus = () => {
      const audioTrack = participant.getTrackPublication(
        Track.Source.Microphone,
      );
      const isMuted =
        !audioTrack || audioTrack.isMuted || !audioTrack.isSubscribed;
      setPlayerMuteStatus(sessionId, isMuted);
    };

    updateMuteStatus();

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

    return () => {
      participant.off("trackMuted", onTrackMuted);
      participant.off("trackUnmuted", onTrackUnmuted);
      participant.off("trackPublished", onTrackPublished);
      participant.off("trackUnpublished", onTrackUnpublished);
      participant.off("trackSubscribed", onTrackSubscribed);
      participant.off("trackUnsubscribed", onTrackUnsubscribed);
    };
  }, [room, sessionId, setPlayerMuteStatus]);

  if (!player) return null;

  return (
    <CharacterModelProvider model={model}>
      <RemoteCharacterAnimation sessionId={sessionId} />
      <primitive object={model.scene}>
        <PlayerTag displayName={player.username} isMuted={player.isMuted} />
      </primitive>
    </CharacterModelProvider>
  );
}
