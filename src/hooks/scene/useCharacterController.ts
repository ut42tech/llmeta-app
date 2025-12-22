import { useFrame } from "@react-three/fiber";
import type { RefObject } from "react";
import { useEffect } from "react";
import { Euler, type Object3D, Vector3 } from "three";
import { useShallow } from "zustand/react/shallow";
import { AVATAR_LIST } from "@/constants/avatars";
import { PHYSICS } from "@/constants/world";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";
import type { MoveData } from "@/types/player";

/**
 * Character controller hook
 * Handles teleport, fall reset, state sync, and server updates
 */
export function useCharacterController(
  characterRef: RefObject<Object3D | null>,
  publishMovement: ((data: MoveData) => void) | undefined,
  isConnected: boolean,
) {
  const {
    pendingTeleport,
    setPosition,
    setRotation,
    sendMovement,
    isFPV,
    currentAvatar,
    setCurrentAvatar,
    setAvatarList,
  } = useLocalPlayerStore(
    useShallow((state) => ({
      pendingTeleport: state.pendingTeleport,
      setPosition: state.setPosition,
      setRotation: state.setRotation,
      sendMovement: state.sendMovement,
      isFPV: state.isFPV,
      currentAvatar: state.currentAvatar,
      setCurrentAvatar: state.setCurrentAvatar,
      setAvatarList: state.setAvatarList,
    })),
  );

  useEffect(() => {
    setAvatarList(AVATAR_LIST);
    if (!currentAvatar) {
      setCurrentAvatar(AVATAR_LIST[0]);
    }
  }, [setAvatarList, setCurrentAvatar, currentAvatar]);

  useFrame((state) => {
    const character = characterRef.current;
    if (!character) return;

    if (pendingTeleport) {
      character.position.copy(pendingTeleport.position);
      if (pendingTeleport.rotation) {
        character.rotation.copy(pendingTeleport.rotation);
      }
      useLocalPlayerStore.setState({ pendingTeleport: null });
    }

    if (character.position.y < PHYSICS.RESET_Y_THRESHOLD) {
      character.position.copy(new Vector3());
    }

    setPosition(character.position);
    if (isFPV) {
      const camY = state.camera.rotation.y;
      setRotation(new Euler(0, camY, 0));
    } else {
      setRotation(character.rotation);
    }

    if (isConnected && publishMovement) {
      sendMovement(publishMovement);
    }
  });
}
