import { useControls } from "leva";
import { useMemo } from "react";
import { RemoteCharacter } from "@/components/character/RemoteCharacter";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";
import { useRemotePlayersStore } from "@/stores/remotePlayersStore";

/**
 * Component that manages all remote players.
 * Mirrors LiveKit data channel updates into the remote player store.
 */
export function RemotePlayers() {
  const players = useRemotePlayersStore((s) => s.players);
  const mySessionId = useLocalPlayerStore((s) => s.sessionId);
  const { showRemotePlayers, showMyRemoteAvatar } = useControls(
    "Remote Players",
    {
      showRemotePlayers: {
        value: true,
      },
      showMyRemoteAvatar: {
        value: false,
      },
    },
    { collapsed: true },
  );

  const visiblePlayers = useMemo(() => {
    if (!showRemotePlayers) return [];
    return Object.values(players).filter((player) =>
      showMyRemoteAvatar ? true : player.sessionId !== mySessionId,
    );
  }, [players, showRemotePlayers, showMyRemoteAvatar, mySessionId]);

  if (!showRemotePlayers) return null;

  return (
    <>
      {visiblePlayers.map((player) => (
        <RemoteCharacter key={player.sessionId} sessionId={player.sessionId} />
      ))}
    </>
  );
}
