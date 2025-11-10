import { RemoteSimpleCharacter } from "@/components/RemoteSimpleCharacter";
import { useRemotePlayersSync } from "@/hooks/useRemotePlayersSync";
import { useRemotePlayersStore } from "@/stores/remotePlayersStore";

/**
 * すべてのリモートプレイヤーを管理するコンポーネント
 * Colyseusルームの状態変更を監視し、プレイヤー情報を更新
 */
export const RemotePlayers = () => {
  useRemotePlayersSync();
  const players = useRemotePlayersStore((s) => s.players);

  return (
    <>
      {Array.from(players.values()).map((player) => (
        <RemoteSimpleCharacter key={player.sessionId} player={player} />
      ))}
    </>
  );
};
