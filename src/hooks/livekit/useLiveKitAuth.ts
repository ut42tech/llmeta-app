import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import { LIVEKIT_CONFIG } from "@/constants/sync";
import { useLocalPlayerStore, useWorldStore } from "@/stores";

type AuthState = {
  token?: string;
  serverUrl?: string;
};

/**
 * Fetches LiveKit authentication token for the given instance.
 * Uses instanceId as the LiveKit room name.
 */
export function useLiveKitAuth(instanceId: string) {
  const identityRef = useRef<string>(nanoid());
  const setFailed = useWorldStore((state) => state.setFailed);
  const [authState, setAuthState] = useState<AuthState>(() => ({
    serverUrl: LIVEKIT_CONFIG.wsUrl || undefined,
  }));

  useEffect(() => {
    let cancelled = false;

    const fetchToken = async () => {
      const identity = identityRef.current;
      if (!identity) {
        return;
      }

      try {
        const params = new URLSearchParams({
          identity,
          roomName: instanceId, // Use instanceId as LiveKit room name
        });
        const latestUsername = useLocalPlayerStore.getState().username;
        if (latestUsername) {
          params.set("name", latestUsername);
        }

        const response = await fetch(
          `${LIVEKIT_CONFIG.tokenEndpoint}?${params.toString()}`,
          { cache: "no-store" },
        );
        if (!response.ok) {
          const message = await response.text();
          throw new Error(
            message || `Failed to fetch LiveKit token (${response.status})`,
          );
        }

        const payload = (await response.json()) as {
          accessToken?: string;
          token?: string;
          serverUrl?: string;
        };

        const accessToken = payload.accessToken || payload.token;
        const serverUrl = LIVEKIT_CONFIG.wsUrl || payload.serverUrl;

        if (!accessToken || !serverUrl) {
          throw new Error("Token response missing accessToken/serverUrl");
        }

        if (cancelled) {
          return;
        }

        setAuthState({
          token: accessToken,
          serverUrl,
        });
      } catch (error) {
        if (cancelled) {
          return;
        }
        const message =
          error instanceof Error ? error.message : "Unknown token error";
        setFailed(message);
      }
    };

    fetchToken();

    return () => {
      cancelled = true;
    };
  }, [instanceId, setFailed]);

  return { authState, identity: identityRef.current };
}
