"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

const EASING = [0.22, 1, 0.36, 1] as const;
const BLUR_IN = { filter: "blur(6px)" };
const BLUR_OUT = { filter: "blur(0px)" };

type BaseProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  blur?: boolean;
  className?: string;
};

export function PageTransition({
  children,
  className,
}: Pick<BaseProps, "children" | "className">) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.6, ease: EASING }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  blur = false,
  className,
}: BaseProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, ...(blur && BLUR_IN) }}
      animate={{ opacity: 1, y: 0, ...(blur && BLUR_OUT) }}
      transition={{ duration, delay, ease: EASING }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({
  children,
  delay = 0,
  duration = 0.5,
  blur = false,
  className,
}: BaseProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, ...(blur && BLUR_IN) }}
      animate={{ opacity: 1, scale: 1, ...(blur && BLUR_OUT) }}
      transition={{ duration, delay, ease: EASING }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const SLIDE_OFFSET = {
  up: { y: 24 },
  down: { y: -24 },
  left: { x: 24 },
  right: { x: -24 },
} as const;

export function SlideIn({
  children,
  direction = "up",
  delay = 0,
  duration = 0.5,
  blur = false,
  className,
}: BaseProps & { direction?: keyof typeof SLIDE_OFFSET }) {
  return (
    <motion.div
      initial={{ opacity: 0, ...SLIDE_OFFSET[direction], ...(blur && BLUR_IN) }}
      animate={{ opacity: 1, x: 0, y: 0, ...(blur && BLUR_OUT) }}
      transition={{ duration, delay, ease: EASING }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
