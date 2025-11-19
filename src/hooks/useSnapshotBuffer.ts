"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Euler, Quaternion, Vector3 } from "three";
import { INTERPOLATION, PERFORMANCE } from "@/constants/world";

/**
 * Lightweight client-side buffer to continuously interpolate
 * quantized snapshot values received from the server.
 * Positions are interpolated with lerp; rotations use quaternion slerp.
 */

export function usePositionBuffer(
  target: Vector3,
  baseFactor: number = PERFORMANCE.POSITION_LERP_FACTOR,
  epsilon: number = INTERPOLATION.POSITION_EPSILON,
) {
  const current = useRef(new Vector3(target.x, target.y, target.z));
  const targetRef = useRef(target);
  targetRef.current = target;

  const initialized = useRef(false);

  useFrame((_, delta) => {
    if (!initialized.current) {
      current.current.copy(targetRef.current);
      initialized.current = true;
      return;
    }

    const alpha = 1 - (1 - baseFactor) ** (delta * INTERPOLATION.TARGET_FPS);
    if (
      current.current.distanceToSquared(targetRef.current) <=
      epsilon * epsilon
    ) {
      current.current.copy(targetRef.current);
      return;
    }
    current.current.lerp(targetRef.current, alpha);
  });

  return current.current;
}

export function useRotationBuffer(
  targetEuler: Euler,
  baseFactor: number = PERFORMANCE.ROTATION_LERP_FACTOR,
  epsilon: number = INTERPOLATION.ROTATION_EPSILON,
) {
  const tmpEuler = useMemo(() => new Euler(), []);
  const tmpQuatTo = useMemo(() => new Quaternion(), []);

  const currentQuat = useRef(new Quaternion());
  const targetRef = useRef(targetEuler);
  targetRef.current = targetEuler;

  const lastEuler = useRef<{ x: number; y: number; z: number } | null>(null);

  const initialized = useRef(false);

  useFrame((_, delta) => {
    const le = lastEuler.current;
    if (
      !le ||
      le.x !== targetRef.current.x ||
      le.y !== targetRef.current.y ||
      le.z !== targetRef.current.z
    ) {
      tmpEuler.set(
        targetRef.current.x,
        targetRef.current.y,
        targetRef.current.z,
      );
      tmpQuatTo.setFromEuler(tmpEuler);
      lastEuler.current = {
        x: targetRef.current.x,
        y: targetRef.current.y,
        z: targetRef.current.z,
      };
    }

    if (!initialized.current) {
      currentQuat.current.copy(tmpQuatTo);
      initialized.current = true;
      return;
    }

    const alpha = 1 - (1 - baseFactor) ** (delta * INTERPOLATION.TARGET_FPS);
    const dot = Math.abs(currentQuat.current.dot(tmpQuatTo));

    if (1 - dot <= epsilon) {
      currentQuat.current.copy(tmpQuatTo);
      return;
    }
    currentQuat.current.slerp(tmpQuatTo, alpha);
  });

  return currentQuat.current;
}
