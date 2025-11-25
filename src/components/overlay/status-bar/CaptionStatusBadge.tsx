"use client";

import { AudioLines } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type CaptionStatusBadgeProps = {
  isStreaming: boolean;
  className?: string;
};

export const CaptionStatusBadge = ({
  isStreaming,
  className,
}: CaptionStatusBadgeProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="secondary"
          className={cn("flex items-center gap-2", className)}
        >
          <AudioLines className="size-3.5" />
          <span>Transcription</span>
          <span
            className={cn(
              "size-2 rounded-full shadow-inner",
              isStreaming ? "bg-green-500" : "bg-zinc-400",
            )}
          />
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        {isStreaming ? "Transcription active" : "Transcription inactive"}
      </TooltipContent>
    </Tooltip>
  );
};
