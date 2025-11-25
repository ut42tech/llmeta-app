/**
 * Deepgram API configuration
 */
export const DEEPGRAM_TOKEN_ENDPOINT = "/api/deepgram/token";
export const DEEPGRAM_MODEL = "nova-3";
export const DEEPGRAM_LANGUAGE = "ja";

/**
 * MediaRecorder configuration
 *
 * Chunk interval: 250ms is the maximum recommended value for real-time streaming
 * (Deepgram supports 20-250ms). Higher values reduce network overhead but increase latency.
 *
 * MIME type: Opus codec in WebM container provides the best balance of:
 * - Low latency (ideal for real-time transcription)
 * - High compression (reduces bandwidth usage)
 * - Wide browser support
 */
export const MEDIA_CHUNK_INTERVAL_MS = 50;
export const PREFERRED_MIME_TYPE = "audio/webm;codecs=opus";

/**
 * UI configuration
 */
export const MAX_CAPTION_ENTRIES = 20;

/**
 * Auto-send to chat configuration
 *
 * Debounce interval: Wait this long after the last transcription entry
 * before combining and sending accumulated text to chat.
 * Shorter values feel more real-time but may send fragmented messages.
 */
export const AUTO_SEND_DEBOUNCE_MS = 2000;
