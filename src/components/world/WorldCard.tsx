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
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer">
        <div className="relative aspect-video bg-muted overflow-hidden flex items-center justify-center">
          <Globe className="size-16 text-muted-foreground/50" />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
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
            <span>{world.player_capacity} max</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
