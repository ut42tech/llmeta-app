"use client";

import { AudioLines } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Props = {
  isStreaming: boolean;
  className?: string;
};

export const CaptionStatusBadge = ({ isStreaming, className }: Props) => {
  return (
    <Badge
      variant="secondary"
      className={cn("flex items-center gap-2", className)}
    >
      <AudioLines className="size-3.5" />
      <span>Transcription</span>
      <span
        className={cn(
          "h-2 w-2 rounded-full shadow-inner",
          isStreaming ? "bg-green-500" : "bg-zinc-400",
        )}
      />
    </Badge>
  );
};
