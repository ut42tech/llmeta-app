"use client";

import { useEffect, useMemo, useState } from "react";
import type { AnimationAction, Group } from "three";
import { AnimationMixer, LoopOnce } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import {
  idleUrl,
  jumpDownUrl,
  jumpForwardUrl,
  jumpLoopUrl,
  jumpUpUrl,
  mannequinUrl,
  runUrl,
  walkUrl,
} from "@/constants";
import type { AnimationName } from "@/stores/localPlayerStore";

type GLTFLoaderWithMeshopt = GLTFLoader & {
  setMeshoptDecoder: (decoder: unknown) => void;
};

export type GltfCharacterAssets = {
  model: Group | null;
  mixer: AnimationMixer | null;
  actions: Map<AnimationName, AnimationAction>;
  isLoaded: boolean;
};

/**
 * Hook that loads a GLTF character (model + animations)
 * and provides an AnimationMixer and action map.
 */
export function useGltfCharacterAssets(): GltfCharacterAssets {
  const [model, setModel] = useState<Group | null>(null);
  const [mixer, setMixer] = useState<AnimationMixer | null>(null);
  const [actions, setActions] = useState<Map<AnimationName, AnimationAction>>(
    () => new Map(),
  );

  const gltfLoader = useMemo(() => {
    const loader = new GLTFLoader() as GLTFLoaderWithMeshopt;
    loader.setMeshoptDecoder(MeshoptDecoder as unknown);
    return loader;
  }, []);

  // Load model
  useEffect(() => {
    let disposed = false;
    (async () => {
      const { scene } = await gltfLoader.loadAsync(mannequinUrl);
      if (disposed) return;
      scene.traverse((o) => {
        o.frustumCulled = false;
        o.castShadow = true;
        o.receiveShadow = true;
      });
      setModel(scene);
      setMixer(new AnimationMixer(scene));
    })();
    return () => {
      disposed = true;
    };
  }, [gltfLoader]);
  // Load animations
  useEffect(() => {
    if (!model || !mixer) return;
    let cancelled = false;
    (async () => {
      const entries: Array<[AnimationName, string]> = [
        ["idle", idleUrl],
        ["walk", walkUrl],
        ["run", runUrl],
        ["jumpUp", jumpUpUrl],
        ["jumpLoop", jumpLoopUrl],
        ["jumpDown", jumpDownUrl],
        ["jumpForward", jumpForwardUrl],
      ];

      const map = new Map<AnimationName, AnimationAction>();
      for (const [name, url] of entries) {
        const { animations } = await gltfLoader.loadAsync(url);
        if (!animations?.length) continue;
        const animAction = mixer.clipAction(animations[0], model);

        if (name === "walk") {
          animAction.timeScale = 1 / 0.5;
        } // 2.0
        if (name === "run") {
          animAction.timeScale = 1 / 0.8;
        } // 1.25
        if (name === "jumpForward") {
          animAction.timeScale = 1 / 0.9;
        } // ≈1.111...

        if (
          name === "jumpUp" ||
          name === "jumpDown" ||
          name === "jumpForward"
        ) {
          animAction.loop = LoopOnce;
          animAction.clampWhenFinished = true;
        }

        map.set(name, animAction);
      }
      if (cancelled) return;
      setActions(map);
    })();
    return () => {
      cancelled = true;
    };
  }, [model, mixer, gltfLoader]);

  return {
    model,
    mixer,
    actions,
    isLoaded: !!model && !!mixer && actions.size > 0,
  };
}
