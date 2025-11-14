"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ViverseAvatar } from "@/utils/colyseus";

type AvatarPickerProps = {
  avatars: ViverseAvatar[];
  selectedId?: number;
  onSelect: (avatar: ViverseAvatar) => void;
};

export function AvatarPicker({
  avatars,
  selectedId,
  onSelect,
}: AvatarPickerProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {avatars.map((avatar) => {
        const isSelected = avatar.id === selectedId;
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
              src={avatar.headIconUrl || "https://placehold.co/96x96?text=?"}
              alt={`Avatar ${avatar.id}`}
              fill
              sizes="(max-width: 640px) 25vw, 96px"
              className="object-cover"
              priority={false}
            />
            {isSelected ? (
              <div className="pointer-events-none absolute inset-0 bg-primary/10" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
