"use client";

import { useEffect } from "react";
import {
  COLYSEUS_CONFIG,
  connectToColyseus,
  disconnectFromColyseus,
} from "@/utils/colyseus";

/**
 * Hook to manage the Colyseus connection lifecycle.
 * Automatically connects on mount and disconnects on unmount.
 *
 * @param roomName - Room name to connect to (default: "my_room")
 */
export function useColyseusLifecycle(
  roomName: string = COLYSEUS_CONFIG.DEFAULT_ROOM_NAME,
) {
  useEffect(() => {
    let mounted = true;
    let connecting = false;

    const connect = async () => {
      // Prevent duplicate connections
      if (connecting) return;
      connecting = true;

      try {
        await connectToColyseus(roomName);
        if (mounted) {
          console.log(`[Colyseus] Successfully connected to room: ${roomName}`);
        }
      } catch (error) {
        if (mounted) {
          console.error("[Colyseus] Connection failed:", error);
        }
      } finally {
        connecting = false;
      }
    };

    connect();

    return () => {
      mounted = false;
      disconnectFromColyseus();
      console.log("[Colyseus] Disconnected from room");
    };
  }, [roomName]);
}
