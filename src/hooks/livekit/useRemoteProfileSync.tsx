"use client";

import {
  useParticipantAttribute,
  useRemoteParticipants,
} from "@livekit/components-react";
import type { Participant } from "livekit-client";
import { useEffect } from "react";
import { useRemotePlayersStore } from "@/stores/remotePlayersStore";
import type { ViverseAvatar } from "@/types/player";

/**
 * Parse avatar JSON from participant attribute
 */
const parseAvatar = (avatarJson?: string): ViverseAvatar | undefined => {
  if (!avatarJson) return undefined;
  try {
    return JSON.parse(avatarJson) as ViverseAvatar;
  } catch {
    return undefined;
  }
};

/**
 * Component to sync a single remote participant's profile attributes
 */
function RemoteParticipantProfileSync({
  participant,
}: {
  participant: Participant;
}) {
  const username = useParticipantAttribute("username", { participant });
  const avatarJson = useParticipantAttribute("avatar", { participant });
  const upsertPlayer = useRemotePlayersStore((s) => s.upsertPlayer);

  useEffect(() => {
    const identity = participant.identity;
    if (!identity) return;

    upsertPlayer(identity, {
      username: username || undefined,
      avatar: parseAvatar(avatarJson),
    });
  }, [participant.identity, username, avatarJson, upsertPlayer]);

  return null;
}

/**
 * Hook to sync remote participants' profiles from Participant Attributes.
 * Returns a component that should be rendered inside LiveKitRoom.
 */
export function useRemoteProfileSync() {
  const remoteParticipants = useRemoteParticipants();

  return (
    <>
      {remoteParticipants.map((participant) => (
        <RemoteParticipantProfileSync
          key={participant.identity}
          participant={participant}
        />
      ))}
    </>
  );
}
