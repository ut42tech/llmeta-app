"use client";

import { motion } from "motion/react";

// Animation variants for stagger effects
export const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

// Shared Settings Section component
export type SettingsSectionProps = {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
};

export const SettingsSection = ({
  title,
  icon,
  children,
}: SettingsSectionProps) => (
  <motion.div className="space-y-3" variants={staggerItem}>
    <h3 className="flex items-center gap-2 font-semibold text-sm">
      {icon}
      {title}
    </h3>
    {children}
  </motion.div>
);

// Shared Info Row component
export type InfoRowProps = {
  label: string;
  value: string;
  mono?: boolean;
};

export const InfoRow = ({ label, value, mono }: InfoRowProps) => (
  <motion.div
    className="flex items-center justify-between py-1.5"
    initial={{ opacity: 0, x: -8 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.2 }}
  >
    <span className="font-medium text-muted-foreground text-sm">{label}</span>
    <span
      className={
        mono
          ? "max-w-50 break-all text-right font-mono text-foreground/80 text-xs"
          : "font-semibold text-base"
      }
    >
      {value}
    </span>
  </motion.div>
);
