import type { UIMessage } from "ai";

// =============================================================================
// Tool Result Types
// =============================================================================

/**
 * Image generation tool state
 */
export type ImageToolState =
  | "input-streaming"
  | "input-available"
  | "output-available"
  | "output-error";

/**
 * Image generation tool part (used in AI chat responses)
 */
export type ImageToolPart = {
  type: string;
  toolCallId: string;
  state: ImageToolState;
  input?: { prompt?: string };
  output?: { imageUrl?: string; prompt?: string };
  errorText?: string;
};

// =============================================================================
// Message Types
// =============================================================================

/**
 * Props for rendering individual message parts
 */
export type MessagePartRendererProps = {
  message: UIMessage;
  part: UIMessage["parts"][number];
  index: number;
  isStreaming: boolean;
  canSendToChat: boolean;
  onSendToChat: (url: string, prompt?: string) => void;
  onRefine: (msg: string) => void;
};

// =============================================================================
// Context Injection Types
// =============================================================================

export type AIContext = {
  currentDateTime: string;
};
