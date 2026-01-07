"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ViverseAvatar } from "@/types/player";

type AvatarPickerProps = {
  avatars: ViverseAvatar[];
  selectedId?: number;
  onSelect: (avatar: ViverseAvatar) => void;
  disabled?: boolean;
};

const PLACEHOLDER_IMAGE = "https://placehold.co/96x96?text=?";

export const AvatarPicker = ({
  avatars,
  selectedId,
  onSelect,
  disabled,
}: AvatarPickerProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-4 gap-3",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      {avatars.map((avatar, index) => {
        const isSelected = avatar.id === selectedId;
        const src = avatar.headIconUrl ?? PLACEHOLDER_IMAGE;

        return (
          <motion.button
            key={avatar.id}
            type="button"
            onClick={() => onSelect(avatar)}
            disabled={disabled}
            className={cn(
              "group relative aspect-square overflow-hidden rounded-lg border transition-colors",
              isSelected
                ? "border-primary/50 ring-2 ring-primary"
                : "hover:border-foreground/30",
              disabled && "cursor-not-allowed",
            )}
            aria-pressed={isSelected}
            aria-label={`Select avatar #${avatar.id}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + index * 0.03 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Image
              src={src}
              alt={`Avatar ${avatar.id}`}
              fill
              sizes="(max-width: 640px) 25vw, 96px"
              className="object-cover"
              loading="eager"
              priority={isSelected}
            />
            {isSelected && (
              <motion.div
                className="pointer-events-none absolute inset-0 bg-primary/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};
