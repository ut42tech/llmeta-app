import {
  createLocalAudioTrack,
  type LocalAudioTrack,
  type Room,
  Track,
} from "livekit-client";
import { create } from "zustand";

export type VoicePermissionStatus = "unknown" | "granted" | "denied";

type KrispNoiseFilterProcessor = {
  setEnabled: (enabled: boolean) => Promise<boolean | undefined>;
  isEnabled: () => boolean;
};

type VoiceChatState = {
  track?: LocalAudioTrack;
  isMicEnabled: boolean;
  isPublishing: boolean;
  permission: VoicePermissionStatus;
  error?: string;
  lastActiveAt?: number;
  krispFilter?: KrispNoiseFilterProcessor;
  krispEnabled: boolean;
  krispSupported: boolean;
};

type VoiceChatActions = {
  reset: () => void;
  enableMic: (room?: Room) => Promise<void>;
  disableMic: (room?: Room) => Promise<void>;
  toggleMic: (room?: Room) => Promise<void>;
  setKrispEnabled: (enabled: boolean) => Promise<void>;
  initKrisp: () => Promise<void>;
};

type VoiceChatStore = VoiceChatState & VoiceChatActions;

const initialState: VoiceChatState = {
  track: undefined,
  isMicEnabled: false,
  isPublishing: false,
  permission: "unknown",
  error: undefined,
  lastActiveAt: undefined,
  krispFilter: undefined,
  krispEnabled: true,
  krispSupported: false,
};

export const useVoiceChatStore = create<VoiceChatStore>((set, get) => ({
  ...initialState,
  reset: () => {
    const track = get().track;
    // Always release the microphone so browsers drop the permission indicator
    track?.stop();
    set(initialState);
  },

  enableMic: async (room) => {
    if (!room || get().isPublishing) {
      return;
    }

    set({ isPublishing: true, error: undefined });

    let createdTrack: LocalAudioTrack | undefined;

    try {
      createdTrack = await createLocalAudioTrack({
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      });

      await room.localParticipant.publishTrack(createdTrack, {
        source: Track.Source.Microphone,
      });

      set({
        track: createdTrack,
        isMicEnabled: true,
        permission: "granted",
        lastActiveAt: Date.now(),
      });

      const { krispEnabled, krispSupported } = get();
      if (krispEnabled && krispSupported) {
        try {
          const { KrispNoiseFilter } = await import(
            "@livekit/krisp-noise-filter"
          );
          const filter = KrispNoiseFilter();
          await createdTrack.setProcessor(filter);
          await filter.setEnabled(true);
          set({ krispFilter: filter });
        } catch (error) {
          console.error("[Krisp] Failed to auto-enable filter", error);
        }
      }
    } catch (error) {
      createdTrack?.stop();

      const isPermissionError =
        error instanceof DOMException && error.name === "NotAllowedError";

      set({
        error: error instanceof Error ? error.message : "Microphone error",
        permission: isPermissionError ? "denied" : get().permission,
        isMicEnabled: false,
      });
    } finally {
      set({ isPublishing: false });
    }
  },

  disableMic: async (room) => {
    const track = get().track;
    if (!track) {
      set({ isMicEnabled: false, lastActiveAt: undefined });
      return;
    }

    set({ isPublishing: true, error: undefined });

    try {
      if (room) {
        await room.localParticipant.unpublishTrack(track);
      }
    } catch (error) {
      console.warn("[VoiceChat] Failed to unpublish microphone", error);
    } finally {
      track.stop();
      set({
        track: undefined,
        isMicEnabled: false,
        isPublishing: false,
        lastActiveAt: undefined,
      });
    }
  },

  toggleMic: async (room) => {
    if (get().isMicEnabled) {
      await get().disableMic(room);
    } else {
      await get().enableMic(room);
    }
  },

  initKrisp: async () => {
    try {
      const { isKrispNoiseFilterSupported } = await import(
        "@livekit/krisp-noise-filter"
      );
      const supported = isKrispNoiseFilterSupported();
      set({ krispSupported: supported });
    } catch (error) {
      console.error("[Krisp] Failed to check support", error);
      set({ krispSupported: false });
    }
  },

  setKrispEnabled: async (enabled: boolean) => {
    const { track, krispFilter, krispSupported } = get();

    if (!krispSupported) {
      console.warn("[Krisp] Krisp is not supported in this browser");
      return;
    }

    if (!track) {
      console.warn("[Krisp] No audio track available");
      return;
    }

    try {
      // Initialize filter if not already done
      if (!krispFilter && enabled) {
        const { KrispNoiseFilter } = await import(
          "@livekit/krisp-noise-filter"
        );
        const filter = KrispNoiseFilter();
        await track.setProcessor(filter);
        await filter.setEnabled(true);
        set({ krispFilter: filter, krispEnabled: true });
      } else if (krispFilter) {
        await krispFilter.setEnabled(enabled);
        set({ krispEnabled: enabled });
      }
    } catch (error) {
      console.error("[Krisp] Failed to toggle filter", error);
      set({
        error: error instanceof Error ? error.message : "Krisp filter error",
      });
    }
  },
}));
