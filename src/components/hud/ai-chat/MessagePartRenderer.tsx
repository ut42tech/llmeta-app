"use client";

import { MessageResponse } from "@/components/ai-elements/message";
import { ImageToolResult } from "@/components/hud/ai-chat/ImageToolResult";
import type { ImageToolPart, MessagePartRendererProps } from "@/types/ai";

/**
 * Renders individual message parts (text, images, tool results).
 * Extracted for better code organization and reusability.
 */
export const MessagePartRenderer = ({
  message,
  part,
  index,
  isStreaming,
  canSendToChat,
  onSendToChat,
  onRefine,
}: MessagePartRendererProps) => {
  const key = `${message.id}-${index}`;

  if (part.type === "text") {
    return <MessageResponse key={key}>{part.text}</MessageResponse>;
  }

  if (part.type === "tool-generateImage") {
    return (
      <ImageToolResult
        key={key}
        toolPart={part as unknown as ImageToolPart}
        isStreaming={isStreaming}
        canSendToChat={canSendToChat}
        onSendToChat={onSendToChat}
        onRefine={onRefine}
      />
    );
  }

  return null;
};
