"use client";

import { ImageIcon, Send, WandSparkles } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ImageToolPart } from "@/types";

// =============================================================================
// Types
// =============================================================================

type ImageToolResultProps = {
  toolPart: ImageToolPart;
  isStreaming: boolean;
  canSendToChat: boolean;
  onSendToChat: (imageUrl: string, prompt?: string) => void;
  onRefine: (message: string) => void;
};

// =============================================================================
// Component
// =============================================================================

export const ImageToolResult = ({
  toolPart,
  isStreaming,
  canSendToChat,
  onSendToChat,
  onRefine,
}: ImageToolResultProps) => {
  const t = useTranslations("aiChat");
  const tCommon = useTranslations("common");

  const [isRefining, setIsRefining] = useState(false);
  const [refineInput, setRefineInput] = useState("");

  const handleRefine = () => {
    if (!refineInput.trim()) return;
    const originalPrompt = toolPart.output?.prompt || "the previous image";
    onRefine(
      `Please regenerate the image with these modifications: "${refineInput}". Original prompt was: "${originalPrompt}"`,
    );
    setIsRefining(false);
    setRefineInput("");
  };

  const handleSendToChat = () => {
    if (toolPart.output?.imageUrl) {
      onSendToChat(toolPart.output.imageUrl, toolPart.output.prompt);
    }
  };

  // Loading state
  if (
    toolPart.state === "input-streaming" ||
    toolPart.state === "input-available"
  ) {
    const promptText = toolPart.input?.prompt || "";
    return (
      <div className="flex max-w-sm flex-col gap-3 rounded-xl border border-border/50 bg-muted/30 p-4">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <ImageIcon className="size-5 text-primary" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <Shimmer className="font-medium text-sm" duration={1.5}>
              {t("generatingImage", { prompt: "" }).replace(": ", "")}
            </Shimmer>
            {promptText && (
              <p className="wrap-break-words line-clamp-2 text-muted-foreground text-xs">
                {promptText}
              </p>
            )}
          </div>
        </div>
        <AspectRatio
          ratio={1}
          className="overflow-hidden rounded-lg bg-muted/50"
        >
          <div className="absolute inset-0 animate-pulse bg-linear-to-r from-muted/30 via-muted/60 to-muted/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageIcon className="size-8 text-muted-foreground/40" />
          </div>
        </AspectRatio>
      </div>
    );
  }

  // Error state
  if (toolPart.state === "output-error") {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-destructive text-sm">
        <div className="flex items-center gap-2">
          <ImageIcon className="size-4 shrink-0" />
          <span>
            {t("errorGeneratingImage", {
              error: toolPart.errorText || "Unknown error",
            })}
          </span>
        </div>
      </div>
    );
  }

  // Success state
  if (toolPart.state === "output-available" && toolPart.output?.imageUrl) {
    return (
      <div className="flex max-w-sm flex-col gap-3">
        <div className="overflow-hidden rounded-xl border border-border/50">
          <AspectRatio ratio={1}>
            <Image
              src={toolPart.output.imageUrl}
              alt={toolPart.output.prompt || "Generated image"}
              fill
              className="object-cover"
              unoptimized
            />
          </AspectRatio>
        </div>

        {toolPart.output.prompt && (
          <p className="wrap-break-words text-muted-foreground text-xs leading-relaxed">
            {toolPart.output.prompt}
          </p>
        )}

        {isRefining ? (
          <div className="flex flex-col gap-3 rounded-xl border border-border/50 bg-muted/30 p-4">
            <input
              type="text"
              value={refineInput}
              onChange={(e) => setRefineInput(e.target.value)}
              placeholder={t("refinePlaceholder")}
              className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              onKeyDown={(e) => {
                if (e.nativeEvent.isComposing || e.key === "Process") return;
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleRefine();
                }
                if (e.key === "Escape") {
                  setIsRefining(false);
                  setRefineInput("");
                }
              }}
              ref={(input) => input?.focus()}
            />
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                className="flex-1 gap-2"
                onClick={handleRefine}
                disabled={!refineInput.trim() || isStreaming}
              >
                <WandSparkles className="size-3.5" />
                {t("regenerate")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsRefining(false);
                  setRefineInput("");
                }}
              >
                {tCommon("cancel")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => setIsRefining(true)}
                  disabled={isStreaming}
                >
                  <WandSparkles className="size-3.5" />
                  {t("refine")}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("refineTooltip")}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={handleSendToChat}
                  disabled={!canSendToChat}
                >
                  <Send className="size-3.5" />
                  {t("sendToChat")}
                </Button>
              </TooltipTrigger>
              {!canSendToChat && (
                <TooltipContent>
                  <p>{t("connectToSend")}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        )}
      </div>
    );
  }

  return null;
};
