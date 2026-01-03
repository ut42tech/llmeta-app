/**
 * World type definitions for the VRChat-style world/instance system.
 */

import type { Tables } from "./supabase";

/**
 * World type from Supabase database
 */
export type World = Tables<"worlds">;

/**
 * Instance type from Supabase database
 */
export type DbInstance = Tables<"instances">;

/**
 * Instance type with host name for display purposes
 */
export type Instance = DbInstance & {
  hostName?: string;
};
