import { ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function InstanceLobbyLoading() {
  return (
    <div className="h-[calc(100dvh-6rem)] p-6 lg:p-8">
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col">
        {/* Back Button */}
        <div className="mb-4 shrink-0">
          <Button variant="ghost" size="sm" disabled>
            <ArrowLeft className="mr-2 size-4" />
            <Skeleton className="h-4 w-12" />
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Avatar Preview Area */}
          <div className="relative flex h-full items-center justify-center overflow-hidden rounded-2xl bg-linear-to-b from-muted/50 to-muted">
            <div className="flex flex-col items-center gap-4">
              <div className="flex size-32 items-center justify-center rounded-full bg-muted-foreground/10">
                <User className="size-16 text-muted-foreground/50" />
              </div>
              <Skeleton className="h-4 w-24" />
            </div>
            {/* Player Info Card */}
            <div className="absolute right-4 bottom-4 left-4">
              <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/95 px-4 py-3 shadow-md backdrop-blur-md">
                <Skeleton className="size-9 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="mt-1 h-3 w-16" />
                </div>
              </div>
            </div>
          </div>

          {/* Instance Info Panel */}
          <div className="flex min-h-0 flex-col">
            {/* Instance Header */}
            <div className="mb-6 shrink-0">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="mt-2 h-4 w-32" />
            </div>

            {/* Stats Row */}
            <div className="mb-6 grid shrink-0 grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>

            {/* Connection Status */}
            <div className="mb-6 shrink-0">
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>

            {/* Join Button */}
            <div className="mt-auto shrink-0">
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
