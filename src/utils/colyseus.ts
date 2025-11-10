import { MapSchema, Schema, type } from "@colyseus/schema";
import { colyseus } from "use-colyseus";

/**
 * Colyseus configuration constants
 */
export const COLYSEUS_CONFIG = {
  DEFAULT_ENDPOINT: "http://localhost:2567",
  DEFAULT_ROOM_NAME: "my_room",
} as const;

/**
 * Message types (must match server)
 */
export enum MessageType {
  CHANGE_PROFILE,
  MOVE,
}

/**
 * 3D vector schema
 */
export class Vec3 extends Schema {
  @type("number") x = 0;
  @type("number") y = 0;
  @type("number") z = 0;
}

/**
 * Plain 3D vector object (for messages)
 */
export type Vec3Data = {
  x: number;
  y: number;
  z: number;
};

/**
 * Profile update message
 */
export type ProfileData = {
  username?: string;
};

/**
 * Movement and pose update message (outbound)
 */
export type MoveData = {
  position?: Vec3Data;
  rotation?: Vec3Data;
  animation?: string;
};

/**
 * Player state schema
 */
export class Player extends Schema {
  @type("string") username = "Player";
  @type(Vec3) position = new Vec3();
  @type(Vec3) rotation = new Vec3();
  @type("string") animation = "idle";
}

/**
 * Room state schema
 */
export class MyRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}

/**
 * Colyseus client and hooks
 */
const serverEndpoint =
  process.env.NEXT_PUBLIC_SERVER_ENDPOINT || COLYSEUS_CONFIG.DEFAULT_ENDPOINT;

export const {
  client,
  connectToColyseus,
  disconnectFromColyseus,
  useColyseusRoom,
  useColyseusState,
} = colyseus<MyRoomState>(serverEndpoint, MyRoomState);
