import { useFrame } from "@react-three/fiber";
import { RunAction } from "@react-three/viverse";
import { useHotkeys } from "react-hotkeys-hook";
import { useLocalPlayerStore } from "@/stores";

export function useCameraController() {
  const toggleFPV = useLocalPlayerStore((state) => state.toggleFPV);

  useHotkeys("v", toggleFPV, {
    preventDefault: true,
    enableOnFormTags: false,
  });

  useFrame((state, delta) => {
    if ("fov" in state.camera) {
      const targetFov = RunAction.get() ? 75 : 60;
      const t = 1 - Math.exp(-10 * delta);
      state.camera.fov += (targetFov - state.camera.fov) * t;
      state.camera.updateProjectionMatrix?.();
    }
  });
}
