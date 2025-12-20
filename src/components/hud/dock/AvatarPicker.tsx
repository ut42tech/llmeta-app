"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ViverseAvatar } from "@/types/player";

type AvatarPickerProps = {
  avatars: ViverseAvatar[];
  selectedId?: number;
  onSelect: (avatar: ViverseAvatar) => void;
};

const PLACEHOLDER_IMAGE = "https://placehold.co/96x96?text=?";

export const AvatarPicker = ({
  avatars,
  selectedId,
  onSelect,
}: AvatarPickerProps) => {
  return (
    <div className="grid grid-cols-4 gap-3">
      {avatars.map((avatar) => {
        const isSelected = avatar.id === selectedId;
        const src = avatar.headIconUrl ?? PLACEHOLDER_IMAGE;

        return (
          <button
            key={avatar.id}
            type="button"
            onClick={() => onSelect(avatar)}
            className={cn(
              "group relative aspect-square overflow-hidden rounded-lg border transition",
              isSelected
                ? "ring-2 ring-primary border-primary/50"
                : "hover:border-foreground/30",
            )}
            aria-pressed={isSelected}
            aria-label={`Select avatar #${avatar.id}`}
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
              <div className="pointer-events-none absolute inset-0 bg-primary/10" />
            )}
          </button>
        );
      })}
    </div>
  );
};
