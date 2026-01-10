import { Home } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function HubLoading() {
  return (
    <div className="p-6 lg:p-8">
      {/* Header Skeleton */}
      <header className="mb-8">
        <div className="flex items-center gap-2">
          <Home className="size-8 text-muted-foreground" />
          <Skeleton className="h-9 w-48" />
        </div>
        <Skeleton className="mt-2 h-5 w-72" />
      </header>

      {/* Section Title Skeleton */}
      <section>
        <Skeleton className="mb-4 h-7 w-32" />
        {/* World Cards Grid Skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((key) => (
            <Skeleton
              key={`skeleton-${key}`}
              className="aspect-square w-full rounded-xl"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
