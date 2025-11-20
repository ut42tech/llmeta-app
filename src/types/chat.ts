export type ChatMessagePacket = {
  id: string;
  text: string;
  username?: string;
  sentAt: number;
};

export type ChatMessageDirection = "incoming" | "outgoing" | "system";

export type ChatMessageStatus = "pending" | "sent" | "failed";

export type ChatMessage = {
  id: string;
  sessionId: string;
  username?: string;
  content: string;
  direction: ChatMessageDirection;
  status?: ChatMessageStatus;
  sentAt: number;
};
