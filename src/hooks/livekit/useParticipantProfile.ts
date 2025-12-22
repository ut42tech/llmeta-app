/**
 * Hook for syncing player profile via LiveKit Participant Attributes.
 * Replaces the previous DataChannel-based profile sync.
 *
 * Benefits:
 * - Automatic sync to late joiners (LiveKit server manages state)
 * - No need to re-broadcast on ParticipantConnected
 * - Simpler architecture with single source of truth
 */
import {
  useLocalParticipant,
  useRemoteParticipants,
} from "@livekit/components-react";
import { useCallback, useEffect, useRef } from "react";
import { useRemotePlayersStore } from "@/stores/remotePlayersStore";
import type { ProfileData, ViverseAvatar } from "@/types/player";

const ATTR_KEYS = {
  USERNAME: "profile.username",
  AVATAR: "profile.avatar",
} as const;

/**
 * Parse ViverseAvatar from JSON string stored in attributes
 */
const parseAvatar = (
  avatarJson: string | undefined,
): ViverseAvatar | undefined => {
  if (!avatarJson) return undefined;
  try {
    return JSON.parse(avatarJson) as ViverseAvatar;
  } catch {
    return undefined;
  }
};

/**
 * Extract ProfileData from participant attributes
 */
const getProfileFromAttributes = (
  attributes: Record<string, string>,
): ProfileData => ({
  username: attributes[ATTR_KEYS.USERNAME] || undefined,
  avatar: parseAvatar(attributes[ATTR_KEYS.AVATAR]),
});

/**
 * Hook to manage local participant's profile via attributes
 */
function useLocalProfile() {
  const { localParticipant } = useLocalParticipant();
  const lastSentRef = useRef<{ username?: string; avatar?: string }>({});

  const setProfile = useCallback(
    async (profile: ProfileData) => {
      if (!localParticipant) return;

      const updates: Record<string, string> = {};

      if (
        profile.username !== undefined &&
        profile.username !== lastSentRef.current.username
      ) {
        updates[ATTR_KEYS.USERNAME] = profile.username;
        lastSentRef.current.username = profile.username;
      }

      if (profile.avatar !== undefined) {
        const avatarJson = JSON.stringify(profile.avatar);
        if (avatarJson !== lastSentRef.current.avatar) {
          updates[ATTR_KEYS.AVATAR] = avatarJson;
          lastSentRef.current.avatar = avatarJson;
        }
      }

      if (Object.keys(updates).length > 0) {
        try {
          await localParticipant.setAttributes(updates);
        } catch (error) {
          console.warn("[ParticipantProfile] Failed to set attributes:", error);
        }
      }
    },
    [localParticipant],
  );

  return { setProfile };
}

/**
 * Hook to sync remote participants' profiles from attributes to store.
 * useRemoteParticipants already re-renders when attributes change,
 * so we don't need manual event listeners.
 */
function useRemoteProfileSync() {
  const remoteParticipants = useRemoteParticipants();
  const upsertPlayer = useRemotePlayersStore((s) => s.upsertPlayer);

  useEffect(() => {
    for (const participant of remoteParticipants) {
      const profile = getProfileFromAttributes(participant.attributes);
      const identity = participant.identity || participant.sid;

      if (identity) {
        upsertPlayer(identity, {
          username: profile.username || "Anonymous",
          avatar: profile.avatar,
        });
      }
    }
  }, [remoteParticipants, upsertPlayer]);
}

/**
 * Combined hook for profile sync (use in LiveKitSyncProvider)
 */
export function useParticipantProfile() {
  const { setProfile } = useLocalProfile();
  useRemoteProfileSync();

  return { setProfile };
}
