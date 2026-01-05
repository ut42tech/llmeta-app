"use client";

import { ImageIcon, Send, WandSparkles } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// =============================================================================
// Types
// =============================================================================

type ImageToolPart = {
  type: string;
  toolCallId: string;
  state:
    | "input-streaming"
    | "input-available"
    | "output-available"
    | "output-error";
  input?: { prompt?: string };
  output?: { imageUrl?: string; prompt?: string };
  errorText?: string;
};

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
    return (
      <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-muted-foreground text-sm">
        <ImageIcon className="size-4 animate-pulse" />
        <span>
          {t("generatingImage", { prompt: toolPart.input?.prompt || "" })}
        </span>
      </div>
    );
  }

  // Error state
  if (toolPart.state === "output-error") {
    return (
      <div className="rounded-lg bg-red-50 p-3 text-red-600 text-sm">
        {t("errorGeneratingImage", {
          error: toolPart.errorText || "Unknown error",
        })}
      </div>
    );
  }

  // Success state
  if (toolPart.state === "output-available" && toolPart.output?.imageUrl) {
    return (
      <div className="space-y-2">
        <Image
          src={toolPart.output.imageUrl}
          alt={toolPart.output.prompt || "Generated image"}
          width={512}
          height={512}
          className="h-auto max-w-full overflow-hidden rounded-lg"
          unoptimized
        />

        {toolPart.output.prompt && (
          <p className="text-muted-foreground text-xs">
            {toolPart.output.prompt}
          </p>
        )}

        {isRefining ? (
          <div className="space-y-2">
            <input
              type="text"
              value={refineInput}
              onChange={(e) => setRefineInput(e.target.value)}
              placeholder={t("refinePlaceholder")}
              className="w-full rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              onKeyDown={(e) => {
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
                <WandSparkles className="size-3" />
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
                  <WandSparkles className="size-3" />
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
                  <Send className="size-3" />
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
