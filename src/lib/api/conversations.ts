import type { AIConversation, AIStoredMessage } from "@/types/chat";

const BASE_URL = "/api/ai/conversations";
const headers = { "Content-Type": "application/json" };

export const conversationsApi = {
  async list(instanceId?: string | null): Promise<AIConversation[]> {
    const query = instanceId ? `?instanceId=${instanceId}` : "";
    const res = await fetch(`${BASE_URL}${query}`);
    if (!res.ok) return [];
    const { conversations } = await res.json();
    return conversations;
  },

  async getMessages(conversationId: string): Promise<AIStoredMessage[]> {
    const res = await fetch(`${BASE_URL}?conversationId=${conversationId}`);
    if (!res.ok) return [];
    const { messages } = await res.json();
    return messages;
  },

  async create(
    instanceId?: string | null,
    title?: string,
  ): Promise<AIConversation | null> {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({ instanceId, title }),
    });
    if (!res.ok) return null;
    const { conversation } = await res.json();
    return conversation;
  },

  async delete(conversationId: string): Promise<boolean> {
    const res = await fetch(BASE_URL, {
      method: "DELETE",
      headers,
      body: JSON.stringify({ conversationId }),
    });
    return res.ok;
  },

  async updateTitle(conversationId: string, title: string): Promise<boolean> {
    const res = await fetch(BASE_URL, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ conversationId, title }),
    });
    return res.ok;
  },
};
