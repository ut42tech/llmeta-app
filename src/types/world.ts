/**
 * World type definitions for the VRChat-style world/instance system.
 */

import type { Vector3 } from "three";
import type { Tables } from "./supabase";

/**
 * World content item for displaying user-generated content in the 3D world
 */
export type WorldContentItem = {
  id: string;
  position: Vector3;
  image: {
    url: string;
    prompt?: string;
  };
  username?: string;
  createdAt: number;
};

/**
 * World type from Supabase database
 */
export type World = Tables<"worlds">;

/**
 * World with instance count for home page display
 */
export type WorldWithInstanceCount = World & {
  instanceCount: number;
};

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
