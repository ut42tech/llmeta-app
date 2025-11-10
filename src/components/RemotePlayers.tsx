import { useControls } from "leva";
import { RemoteSimpleCharacter } from "@/components/RemoteSimpleCharacter";
import { useRemotePlayersSync } from "@/hooks/useRemotePlayersSync";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";
import { useRemotePlayersStore } from "@/stores/remotePlayersStore";

/**
 * Component that manages all remote players.
 * Watches Colyseus room state changes and updates player info.
 */
export const RemotePlayers = () => {
  useRemotePlayersSync();
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

  if (!showRemotePlayers) return null;

  return (
    <>
      {Array.from(players.values())
        .filter((player) =>
          showMyRemoteAvatar ? true : player.sessionId !== mySessionId,
        )
        .map((player) => (
          <RemoteSimpleCharacter key={player.sessionId} player={player} />
        ))}
    </>
  );
};
