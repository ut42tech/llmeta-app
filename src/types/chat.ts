export type ChatMessageDirection = "incoming" | "outgoing" | "system";

export type ChatMessageStatus = "pending" | "sent" | "failed";

export type ChatMessageImage = {
  url: string;
  prompt?: string;
};

export type ChatMessage = {
  id: string;
  sessionId: string;
  username?: string;
  content: string;
  direction: ChatMessageDirection;
  status?: ChatMessageStatus;
  sentAt: number;
  image?: ChatMessageImage;
};
