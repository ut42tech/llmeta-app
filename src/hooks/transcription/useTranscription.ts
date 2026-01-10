"use client";

import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import { useEffect, useRef } from "react";
import {
  DEEPGRAM_LANGUAGE,
  DEEPGRAM_MODEL,
  DEEPGRAM_TOKEN_ENDPOINT,
} from "@/constants/transcription";
import { useTranscriptionStore, useVoiceChatStore } from "@/stores";
import { createRecorder, stopRecorder } from "@/utils/media-recorder";

type DeepgramClient = ReturnType<typeof createClient>;
type LiveConnection = ReturnType<DeepgramClient["listen"]["live"]>;

/**
 * Manages real-time audio transcription using Deepgram's streaming API
 *
 * @returns void - State is managed through Zustand stores
 */
export const useTranscription = () => {
  const track = useVoiceChatStore((state) => state.track);
  const isMicEnabled = useVoiceChatStore((state) => state.isMicEnabled);

  const { addEntry, setPartial, setStreaming, setError } =
    useTranscriptionStore();

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const connectionRef = useRef<LiveConnection | null>(null);

  useEffect(() => {
    if (!track || !isMicEnabled) {
      cleanup();
      return;
    }

    let cancelled = false;

    const startTranscription = async () => {
      setError(undefined);

      if (!("MediaRecorder" in window)) {
        setError("MediaRecorder is not supported in this browser");
        return;
      }

      try {
        const response = await fetch(DEEPGRAM_TOKEN_ENDPOINT);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch Deepgram token: ${response.status} ${response.statusText}`,
          );
        }

        const data = (await response.json()) as {
          accessToken?: string;
          error?: string;
        };

        if (data.error) {
          throw new Error(`Deepgram API error: ${data.error}`);
        }

        if (!data.accessToken) {
          throw new Error("Deepgram token response is missing accessToken");
        }

        if (cancelled) return;

        const client = createClient({ accessToken: data.accessToken });
        const connection = client.listen.live({
          model: DEEPGRAM_MODEL,
          language: DEEPGRAM_LANGUAGE,
          smart_format: true,
          interim_results: true,
        });

        connectionRef.current = connection;

        connection.on(LiveTranscriptionEvents.Open, () => {
          if (cancelled) return;

          setStreaming(true);

          try {
            const { recorder, stream } = createRecorder(
              track.mediaStreamTrack,
              (data) => {
                if (connection && data.size > 0) {
                  try {
                    connection.send(data);
                  } catch (error) {
                    console.warn(
                      "[Transcription] Failed to send audio chunk:",
                      error,
                    );
                  }
                }
              },
            );

            recorderRef.current = recorder;
            streamRef.current = stream;
          } catch (error) {
            const message =
              error instanceof Error
                ? error.message
                : "Failed to start audio recorder";
            console.error("[Transcription] Recorder error:", error);
            setError(message);
            cleanup();
          }
        });

        connection.on(LiveTranscriptionEvents.Transcript, (event) => {
          const text = event.channel.alternatives[0]?.transcript?.trim();

          if (!text) {
            if (event.is_final) {
              setPartial(undefined);
            }
            return;
          }

          if (event.is_final) {
            addEntry(text);
            setPartial(undefined);
          } else {
            setPartial(text);
          }
        });

        connection.on(LiveTranscriptionEvents.Error, (event) => {
          const message =
            typeof event === "string"
              ? event
              : event instanceof Error
                ? event.message
                : "Deepgram connection error";
          console.error("[Transcription] Error:", event);
          setError(message);
        });

        connection.on(LiveTranscriptionEvents.Close, () => {
          setStreaming(false);
          stopRecorder(recorderRef.current, streamRef.current);
          recorderRef.current = null;
          streamRef.current = null;
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to initialize transcription";
        console.error("[Transcription] Initialization failed:", error);
        setError(message);
        cleanup();
      }
    };

    void startTranscription();

    return () => {
      cancelled = true;
      cleanup();
    };

    /**
     * Cleanup function to release all resources
     * Called when microphone is disabled or component unmounts
     */
    function cleanup() {
      stopRecorder(recorderRef.current, streamRef.current);
      recorderRef.current = null;
      streamRef.current = null;

      const connection = connectionRef.current;
      if (connection) {
        try {
          connection.requestClose();
        } catch (error) {
          console.warn("[Transcription] Failed to close connection:", error);
        }
      }
      connectionRef.current = null;

      setStreaming(false);
      setPartial(undefined);
    }
  }, [track, isMicEnabled, addEntry, setPartial, setStreaming, setError]);
};
