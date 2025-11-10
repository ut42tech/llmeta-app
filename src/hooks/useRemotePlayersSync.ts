"use client";

import { useEffect } from "react";
import { Euler, Vector3 } from "three";
import type { AnimationName } from "@/stores/localPlayerStore";
import { useRemotePlayersStore } from "@/stores/remotePlayersStore";
import { type Player, useColyseusState } from "@/utils/colyseus";

/**
 * Colyseusのルーム状態とZustandストアの同期を行うフック。
 * 追加/削除/変更イベントを購読して、リモートプレイヤーのローカルキャッシュを更新する。
 */
export function useRemotePlayersSync() {
  const state = useColyseusState();
  const addOrUpdatePlayer = useRemotePlayersStore((s) => s.addOrUpdatePlayer);
  const removePlayer = useRemotePlayersStore((s) => s.removePlayer);

  useEffect(() => {
    if (!state) return;

    const onAdd = (player: Player, key: string) => {
      if (!player || !player.position || !player.rotation) return;
      addOrUpdatePlayer(key, {
        sessionId: key,
        username: player.username,
        position: new Vector3(
          player.position.x,
          player.position.y,
          player.position.z,
        ),
        rotation: new Euler(
          player.rotation.x,
          player.rotation.y,
          player.rotation.z,
        ),
        animation: player.animation as AnimationName,
      });
    };

    const onRemove = (_player: Player, key: string) => {
      removePlayer(key);
    };

    const onChange = (player: Player, key: string) => {
      if (!player || !player.position || !player.rotation) return;
      addOrUpdatePlayer(key, {
        position: new Vector3(
          player.position.x,
          player.position.y,
          player.position.z,
        ),
        rotation: new Euler(
          player.rotation.x,
          player.rotation.y,
          player.rotation.z,
        ),
        animation: player.animation as AnimationName,
      });
    };

    const unsubAdd = state.players.onAdd(onAdd);
    const unsubRemove = state.players.onRemove(onRemove);
    const unsubChange = state.players.onChange(onChange);

    return () => {
      unsubAdd();
      unsubRemove();
      unsubChange();
    };
  }, [state, addOrUpdatePlayer, removePlayer]);
}
