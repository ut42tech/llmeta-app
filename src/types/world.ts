/**
 * World type definitions for the VRChat-style world/instance system.
 */

export type World = {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  createdAt: string;
  playerCapacity: number;
};

export type Instance = {
  id: string;
  worldId: string;
  roomSid: string;
  roomName: string;
  createdAt: string;
  playerCount: number;
  maxPlayers: number;
  hostName?: string;
};
