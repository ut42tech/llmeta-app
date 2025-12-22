/**
 * Request payload for generating LiveKit access token
 */
export type LiveKitTokenRequest = {
  identity: string;
  name?: string;
  roomName?: string;
  metadata?: Record<string, unknown>;
  ttl?: number;
};

/**
 * Response from LiveKit token generation
 */
export type LiveKitTokenResponse = {
  token: string;
  serverUrl: string;
  roomName: string;
};
