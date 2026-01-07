import { Globe, Users } from "lucide-react";
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
      <Card className="group cursor-pointer overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg">
        <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-muted">
          <Globe className="size-16 text-muted-foreground/50" />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute right-3 bottom-3 left-3">
            <CardTitle className="line-clamp-1 font-medium text-lg text-white">
              {world.name}
            </CardTitle>
          </div>
        </div>
        <CardContent className="p-4">
          <CardDescription className="mb-3 line-clamp-2">
            {world.description}
          </CardDescription>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Users className="size-4" />
            <span>{world.player_capacity} max</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
