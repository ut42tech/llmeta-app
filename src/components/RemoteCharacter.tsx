import { useFrame } from "@react-three/fiber";
import {
  CharacterModelProvider,
  useCharacterModelLoader,
} from "@react-three/viverse";
import { useMemo } from "react";
import { PlayerTag } from "@/components/PlayerTag";
import { RemoteCharacterAnimation } from "@/components/RemoteCharacterAnimation";
import {
  usePositionBuffer,
  useRotationBuffer,
} from "@/hooks/useSnapshotBuffer";
import { useRemotePlayersStore } from "@/stores/remotePlayersStore";

export function RemoteCharacter({ sessionId }: { sessionId: string }) {
  const player = useRemotePlayersStore((state) => state.players.get(sessionId));

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

  if (!player) return null;

  return (
    <CharacterModelProvider model={model}>
      <RemoteCharacterAnimation sessionId={sessionId} />
      <primitive object={model.scene}>
        <PlayerTag displayName={player.username} />
      </primitive>
    </CharacterModelProvider>
  );
}
