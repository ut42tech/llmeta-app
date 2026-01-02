import type { Instance, World } from "@/types/world";

/**
 * Placeholder worlds data.
 * In the future, this will be fetched from an API or database.
 */
export const PLACEHOLDER_WORLDS: World[] = [
  {
    id: "default-world",
    name: "Default World",
    description:
      "The default metaverse world. Explore together with other players in real-time.",
    thumbnail: "/images/world-default.jpg",
    createdAt: "2025-01-01T00:00:00Z",
    playerCapacity: 32,
  },
];

/**
 * Get a world by its ID.
 */
export function getWorldById(worldId: string): World | undefined {
  return PLACEHOLDER_WORLDS.find((world) => world.id === worldId);
}

/**
 * Placeholder instances data.
 * In the future, this will be fetched from LiveKit or a database.
 */
export const PLACEHOLDER_INSTANCES: Instance[] = [
  {
    id: "instance-1",
    worldId: "default-world",
    roomSid: "playground",
    roomName: "Playground",
    createdAt: "2025-01-01T12:00:00Z",
    playerCount: 3,
    maxPlayers: 32,
    hostName: "System",
  },
];

/**
 * Get instances by world ID.
 */
export function getInstancesByWorldId(worldId: string): Instance[] {
  return PLACEHOLDER_INSTANCES.filter(
    (instance) => instance.worldId === worldId,
  );
}

/**
 * Get an instance by its room SID.
 */
export function getInstanceByRoomSid(roomSid: string): Instance | undefined {
  return PLACEHOLDER_INSTANCES.find((instance) => instance.roomSid === roomSid);
}
