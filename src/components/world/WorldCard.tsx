import { Globe, Layers } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { World } from "@/types/world";

type WorldCardProps = {
  world: World;
  instanceCount?: number;
};

export function WorldCard({ world, instanceCount = 0 }: WorldCardProps) {
  return (
    <Link href={`/world/${world.id}`} className="block">
      <Card className="group relative aspect-square w-full cursor-pointer overflow-hidden border-0 bg-linear-to-br from-slate-900 to-slate-800 shadow-md transition-all duration-300 hover:shadow-lg">
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Globe className="size-16 text-muted-foreground/30 transition-colors duration-300 group-hover:text-muted-foreground/50" />
        </div>

        {/* Decorative grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-size[24px_24px]" />
        </div>

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/70 via-black/10 to-transparent p-5">
          {/* Instance count badge */}
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 font-medium text-white/70 text-xs">
              <Layers className="size-3" />
              <span>{instanceCount}</span>
            </div>
          </div>

          {/* Title and description */}
          <div className="space-y-1.5">
            <h3 className="line-clamp-1 font-semibold text-base text-white tracking-tight">
              {world.name}
            </h3>
            <p className="line-clamp-2 text-sm text-white/50 leading-relaxed">
              {world.description}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
