"use client";

import type { RemoteAudioTrack } from "livekit-client";
import { useCallback, useEffect, useRef } from "react";
import type { Vector3 } from "three";
import { PROXIMITY_VOICE } from "@/constants/world";

/**
 * Calculate volume based on distance using exponential falloff for realistic audio attenuation
 *
 * Mimics real-world sound behavior where intensity decreases with the square of distance.
 * This creates a more natural and smooth transition than linear interpolation.
 *
 * @param distance - Distance between listener and speaker
 * @returns Volume value between 0 and 1
 */
export function calculateProximityVolume(distance: number): number {
  const {
    MAX_HEARING_DISTANCE,
    FADE_START_DISTANCE,
    MIN_VOLUME,
    MAX_VOLUME,
    ROLLOFF_FACTOR,
  } = PROXIMITY_VOICE;

  if (distance <= FADE_START_DISTANCE) {
    return MAX_VOLUME;
  }

  if (distance >= MAX_HEARING_DISTANCE) {
    return MIN_VOLUME;
  }

  const fadeRange = MAX_HEARING_DISTANCE - FADE_START_DISTANCE;
  const distanceInFadeZone = distance - FADE_START_DISTANCE;
  const normalizedDistance = distanceInFadeZone / fadeRange;

  const attenuationFactor = normalizedDistance ** ROLLOFF_FACTOR;
  const volume = MAX_VOLUME - attenuationFactor * (MAX_VOLUME - MIN_VOLUME);

  return Math.max(MIN_VOLUME, Math.min(MAX_VOLUME, volume));
}

/**
 * Hook to automatically control remote audio track volume based on 3D proximity
 *
 * @param listenerPosition - Position of the local player (listener)
 * @param speakerPosition - Position of the remote player (speaker)
 * @param audioTrack - Remote audio track to control (can be null/undefined)
 *
 * @example
 * ```tsx
 * const localPosition = useLocalPlayerStore(s => s.position);
 * const remotePosition = useRemotePlayerStore(s => s.players.get(id)?.position);
 * const audioTrack = remoteParticipant.audioTrack;
 *
 * useProximityVoice(localPosition, remotePosition, audioTrack);
 * ```
 */
export function useProximityVoice(
  listenerPosition: Vector3,
  speakerPosition: Vector3,
  audioTrack: RemoteAudioTrack | null | undefined,
) {
  const lastUpdateRef = useRef<number>(0);

  const updateVolume = useCallback(() => {
    if (!audioTrack) return;

    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateRef.current;

    if (timeSinceLastUpdate < PROXIMITY_VOICE.UPDATE_INTERVAL_MS) {
      return;
    }

    lastUpdateRef.current = now;

    try {
      const distance = listenerPosition.distanceTo(speakerPosition);

      const volume = calculateProximityVolume(distance);

      audioTrack.setVolume(volume);
    } catch (error) {
      console.error("[ProximityVoice] Failed to update volume:", error);
    }
  }, [listenerPosition, speakerPosition, audioTrack]);

  useEffect(() => {
    if (!audioTrack) return;

    updateVolume();

    const intervalId = setInterval(
      updateVolume,
      PROXIMITY_VOICE.UPDATE_INTERVAL_MS,
    );

    return () => {
      clearInterval(intervalId);
    };
  }, [updateVolume, audioTrack]);
}
