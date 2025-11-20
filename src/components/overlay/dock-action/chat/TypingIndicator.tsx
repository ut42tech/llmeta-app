import type { TypingUser } from "@/types/chat";

interface TypingIndicatorProps {
  typingUsers: TypingUser[];
}

export function TypingIndicator({ typingUsers }: TypingIndicatorProps) {
  if (typingUsers.length === 0) {
    return null;
  }

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      const user = typingUsers[0];
      const name = user.username || "Someone";
      return `${name}が入力中`;
    }

    if (typingUsers.length === 2) {
      const name1 = typingUsers[0].username || "Someone";
      const name2 = typingUsers[1].username || "Someone";
      return `${name1}と${name2}が入力中`;
    }

    return `${typingUsers.length}人が入力中`;
  };

  return (
    <div className="text-center py-2 text-xs text-muted-foreground">
      <span>{getTypingText()}...</span>
    </div>
  );
}
