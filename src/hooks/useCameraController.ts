import { useFrame } from "@react-three/fiber";
import { RunAction } from "@react-three/viverse";

export function useCameraController() {
  useFrame((state, delta) => {
    if ("fov" in state.camera) {
      const targetFov = RunAction.get() ? 75 : 60;
      const t = 1 - Math.exp(-10 * delta);
      state.camera.fov += (targetFov - state.camera.fov) * t;
      state.camera.updateProjectionMatrix?.();
    }
  });
}
