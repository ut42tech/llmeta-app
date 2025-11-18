import { AccessToken } from "livekit-server-sdk";

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_WS_URL = process.env.LIVEKIT_WS_URL;
const LIVEKIT_DEFAULT_ROOM = process.env.LIVEKIT_DEFAULT_ROOM || "playground";

export type LiveKitTokenRequest = {
  identity: string;
  name?: string;
  roomName?: string;
  metadata?: Record<string, unknown>;
  ttl?: number;
};

export type LiveKitTokenResponse = {
  token: string;
  serverUrl: string;
  roomName: string;
};

const ensureConfig = () => {
  if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET || !LIVEKIT_WS_URL) {
    throw new Error(
      "Missing LiveKit server configuration (API key/secret/url)",
    );
  }

  return {
    apiKey: LIVEKIT_API_KEY,
    apiSecret: LIVEKIT_API_SECRET,
    serverUrl: LIVEKIT_WS_URL,
  };
};

export const createLiveKitAccessToken = async (
  payload: LiveKitTokenRequest,
): Promise<LiveKitTokenResponse> => {
  const config = ensureConfig();
  const roomName = payload.roomName || LIVEKIT_DEFAULT_ROOM;
  const token = new AccessToken(config.apiKey, config.apiSecret, {
    ttl: payload.ttl ?? 60 * 60,
    identity: payload.identity,
    name: payload.name,
    metadata: payload.metadata ? JSON.stringify(payload.metadata) : undefined,
  });

  token.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  const jwt = await token.toJwt();

  return {
    token: jwt,
    serverUrl: config.serverUrl,
    roomName,
  };
};
