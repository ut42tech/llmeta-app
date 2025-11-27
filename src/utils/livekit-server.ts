import { AccessToken } from "livekit-server-sdk";
import type { LiveKitTokenRequest, LiveKitTokenResponse } from "@/types";

const ensureConfig = () => {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const serverUrl = process.env.LIVEKIT_URL;
  if (!apiKey || !apiSecret || !serverUrl) {
    throw new Error(
      "Missing LiveKit server configuration (API key/secret/url)",
    );
  }
  return { apiKey, apiSecret, serverUrl };
};

export const createLiveKitAccessToken = async (
  payload: LiveKitTokenRequest,
): Promise<LiveKitTokenResponse> => {
  const config = ensureConfig();
  const roomName = payload.roomName || process.env.LIVEKIT_ROOM || "playground";

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

  return {
    token: await token.toJwt(),
    serverUrl: config.serverUrl,
    roomName,
  };
};
