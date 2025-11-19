import { useFrame } from "@react-three/fiber";
import type { RefObject } from "react";
import { useEffect } from "react";
import { Euler, type Object3D, Vector3 } from "three";
import { AVATAR_LIST } from "@/constants/avatars";
import { PHYSICS } from "@/constants/world";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";
import { useWorldStore } from "@/stores/worldStore";
import type { MoveData } from "@/types/multiplayer";

/**
 * Character controller hook
 * Handles teleport, fall reset, state sync, and server updates
 */
export function useCharacterController(
  characterRef: RefObject<Object3D | null>,
  publishMovement: ((data: MoveData) => void) | undefined,
  isConnected: boolean,
) {
  const pendingTeleport = useLocalPlayerStore((state) => state.pendingTeleport);
  const setPosition = useLocalPlayerStore((state) => state.setPosition);
  const setRotation = useLocalPlayerStore((state) => state.setRotation);
  const sendMovement = useLocalPlayerStore((state) => state.sendMovement);
  const updateCurrentGridCell = useWorldStore(
    (state) => state.updateCurrentGridCell,
  );

  const isFPV = useLocalPlayerStore((s) => s.isFPV);
  const setCurrentAvatar = useLocalPlayerStore((s) => s.setCurrentAvatar);
  const setAvatarList = useLocalPlayerStore((s) => s.setAvatarList);

  useEffect(() => {
    setAvatarList(AVATAR_LIST);
    setCurrentAvatar(AVATAR_LIST[0]);
  }, [setAvatarList, setCurrentAvatar]);

  useFrame((state) => {
    const character = characterRef.current;
    if (!character) return;

    // Apply pending teleport if present
    if (pendingTeleport) {
      character.position.copy(pendingTeleport.position);
      if (pendingTeleport.rotation) {
        character.rotation.copy(pendingTeleport.rotation);
      }
      useLocalPlayerStore.setState({ pendingTeleport: null });
    }

    // Reset on fall
    if (character.position.y < PHYSICS.RESET_Y_THRESHOLD) {
      character.position.copy(new Vector3());
    }

    // Update player state
    setPosition(character.position);
    if (isFPV) {
      const camY = state.camera.rotation.y;
      setRotation(new Euler(0, camY, 0));
    } else {
      setRotation(character.rotation);
    }

    // Send movement to server
    if (isConnected && publishMovement) {
      sendMovement(publishMovement);
    }

    // Update grid cell
    updateCurrentGridCell(character.position);
  });
}
