"use client";

import { Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import type { World } from "@/types/world";

type WorldCardProps = {
  world: World;
};

export function WorldCard({ world }: WorldCardProps) {
  return (
    <Link href={`/world/${world.id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer">
        <div className="relative aspect-video bg-muted overflow-hidden">
          <Image
            src={world.thumbnail}
            alt={world.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <CardTitle className="text-white text-lg font-medium line-clamp-1">
              {world.name}
            </CardTitle>
          </div>
        </div>
        <CardContent className="p-4">
          <CardDescription className="line-clamp-2 mb-3">
            {world.description}
          </CardDescription>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="size-4" />
            <span>{world.playerCapacity} max</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
