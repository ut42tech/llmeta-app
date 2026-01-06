"use client";

import { useContext } from "react";
import {
  LiveKitSyncContext,
  type LiveKitSyncContextValue,
} from "@/components/providers";

export type SyncClient = LiveKitSyncContextValue;

export function useSyncClient(): SyncClient {
  return useContext(LiveKitSyncContext);
}
