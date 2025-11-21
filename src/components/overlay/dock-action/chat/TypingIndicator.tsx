import { useMemo } from "react";
import type { TypingUser } from "@/types/chat";

interface TypingIndicatorProps {
  typingUsers: TypingUser[];
}

export function TypingIndicator({ typingUsers }: TypingIndicatorProps) {
  const text = useMemo(() => {
    const count = typingUsers.length;
    if (count === 0) return null;

    if (count === 1) {
      const name = typingUsers[0].username || "Someone";
      return `${name} is typing...`;
    }

    if (count === 2) {
      const name1 = typingUsers[0].username || "Someone";
      const name2 = typingUsers[1].username || "Someone";
      return `${name1} and ${name2} are typing...`;
    }

    return `${count} people are typing...`;
  }, [typingUsers]);

  if (!text) return null;

  return (
    <div className="text-center text-xs text-muted-foreground">
      <span>{text}</span>
    </div>
  );
}
