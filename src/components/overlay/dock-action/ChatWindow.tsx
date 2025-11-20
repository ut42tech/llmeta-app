"use client";

import { ChatInput } from "@/components/overlay/dock-action/chat/ChatInput";
import { ChatLog } from "@/components/overlay/dock-action/chat/ChatLog";
import { useTextChat } from "@/hooks/useTextChat";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";

export function ChatWindow() {
  const { messages, canSend, sendMessage } = useTextChat();
  const sessionId = useLocalPlayerStore((state) => state.sessionId);

  return (
    <div className="fixed bottom-4 left-4 z-50 pointer-events-auto">
      <div className="w-80 flex flex-col-reverse gap-2">
        <ChatInput canSend={canSend} onSend={sendMessage} />
        <ChatLog messages={messages} sessionId={sessionId} />
      </div>
    </div>
  );
}
