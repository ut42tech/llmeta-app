export type Vec3Data = {
  x: number;
  y: number;
  z: number;
};

export type ViverseAvatar = {
  headIconUrl: string;
  id: number;
  vrmUrl: string;
};

export type ProfileData = {
  username?: string;
  avatar?: ViverseAvatar;
};

export type MoveData = {
  position?: Vec3Data;
  rotation?: Vec3Data;
  isRunning?: boolean;
  animation?: string;
};
