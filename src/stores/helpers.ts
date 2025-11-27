/**
 * Zustand store helper utilities
 * Provides common patterns for store operations
 */

import type { EntityRecord } from "@/types";

/**
 * Add or update an entity in a record
 */
export function upsertEntity<T extends { [key: string]: unknown }>(
  record: EntityRecord<T>,
  id: string,
  data: Partial<T>,
  defaults: T,
): EntityRecord<T> {
  const existing = record[id];
  return {
    ...record,
    [id]: existing ? { ...existing, ...data } : { ...defaults, ...data },
  };
}

/**
 * Remove an entity from a record
 */
export function removeEntity<T>(
  record: EntityRecord<T>,
  id: string,
): EntityRecord<T> {
  const { [id]: _, ...rest } = record;
  return rest;
}

/**
 * Update a single field of an entity
 */
export function updateEntityField<T, K extends keyof T>(
  record: EntityRecord<T>,
  id: string,
  field: K,
  value: T[K],
): EntityRecord<T> {
  const existing = record[id];
  if (!existing) return record;
  return {
    ...record,
    [id]: { ...existing, [field]: value },
  };
}

/**
 * Count entities in a record
 */
export function countEntities<T>(record: EntityRecord<T>): number {
  return Object.keys(record).length;
}
