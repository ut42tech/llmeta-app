/**
 * Common types used across the application
 */

/**
 * Plain object representation of a 3D vector
 * Used for serialization and network transfer
 */
export type Vec3 = {
  x: number;
  y: number;
  z: number;
};

/**
 * Generic record type helper for ID-based collections
 * Replaces Map<string, T> for better serialization
 */
export type EntityRecord<T> = Record<string, T>;
