import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function WorldDetailLoading() {
  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" disabled>
            <ArrowLeft className="mr-2 size-4" />
            <Skeleton className="h-4 w-12" />
          </Button>
        </div>

        {/* Header */}
        <header className="mb-8">
          <Skeleton className="h-9 w-2/3" />
          <Skeleton className="mt-2 h-5 w-full max-w-md" />
        </header>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((key) => (
            <Skeleton key={`stat-${key}`} className="h-24 w-full rounded-xl" />
          ))}
        </div>

        {/* Instances Section Header */}
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-9 w-36" />
        </div>

        {/* Instance Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[1, 2].map((key) => (
            <Skeleton
              key={`instance-${key}`}
              className="h-32 w-full rounded-xl"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
