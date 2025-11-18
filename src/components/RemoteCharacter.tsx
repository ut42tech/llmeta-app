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
import { makeUniqueModelUrl } from "@/utils/model-loader";

export function RemoteCharacter({ sessionId }: { sessionId: string }) {
  const player = useRemotePlayersStore((state) => state.players.get(sessionId));

  const avatarUrl = useMemo(() => {
    const url = player?.avatar?.vrmUrl;
    return url && url.trim().length > 0 ? url : "/models/avatar_01.vrm";
  }, [player?.avatar?.vrmUrl]);

  const model = useCharacterModelLoader({
    useViverseAvatar: false,
    castShadow: true,
    url: makeUniqueModelUrl(avatarUrl, sessionId),
    type: "vrm",
  });

  // Interpolate position and rotation from server updates
  const smoothPosition = usePositionBuffer(
    player?.position ?? model.scene.position,
  );
  const smoothRotation = useRotationBuffer(
    player?.rotation ?? model.scene.rotation,
  );

  useFrame(() => {
    if (!player) return;

    // Apply smooth interpolated position and rotation
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
