import {
  MEDIA_CHUNK_INTERVAL_MS,
  PREFERRED_MIME_TYPE,
} from "@/constants/transcription";

/**
 * Result of creating a MediaRecorder
 */
export interface RecorderResult {
  recorder: MediaRecorder;
  stream: MediaStream;
}

/**
 * Checks browser support for the preferred audio MIME type
 *
 * @returns The preferred MIME type if supported, otherwise undefined
 */
export const getSupportedMimeType = (): string | undefined => {
  if (
    typeof MediaRecorder.isTypeSupported === "function" &&
    MediaRecorder.isTypeSupported(PREFERRED_MIME_TYPE)
  ) {
    return PREFERRED_MIME_TYPE;
  }
  return undefined;
};

/**
 * Creates and starts a MediaRecorder for streaming audio transcription
 *
 * This function clones the provided track to avoid interfering with the original
 * LiveKit audio stream, then creates a MediaRecorder that periodically emits
 * audio chunks for transcription.
 *
 * @param track - The MediaStreamTrack to record from
 * @param onData - Callback invoked with each audio chunk
 * @returns The created MediaRecorder and its associated MediaStream
 */
export const createRecorder = (
  track: MediaStreamTrack,
  onData: (data: Blob) => void,
): RecorderResult => {
  const clonedTrack = track.clone();
  const stream = new MediaStream([clonedTrack]);

  const mimeType = getSupportedMimeType();
  const options = mimeType ? { mimeType } : undefined;

  const recorder = new MediaRecorder(stream, options);

  recorder.ondataavailable = (event) => {
    if (event.data?.size > 0) {
      onData(event.data);
    }
  };

  recorder.start(MEDIA_CHUNK_INTERVAL_MS);

  return { recorder, stream };
};

/**
 * Stops a MediaRecorder and releases all associated resources
 *
 * This function safely stops the recorder and all tracks in the stream,
 * preventing memory leaks. It's safe to call with null values.
 *
 * @param recorder - The MediaRecorder to stop
 * @param stream - The MediaStream to clean up
 */
export const stopRecorder = (
  recorder: MediaRecorder | null,
  stream: MediaStream | null,
): void => {
  if (recorder && recorder.state !== "inactive") {
    recorder.ondataavailable = null;
    recorder.stop();
  }

  stream?.getTracks().forEach((track) => {
    track.stop();
  });
};
