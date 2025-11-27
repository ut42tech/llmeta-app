"use client";

import { useMemo } from "react";
import type { TypingUser } from "@/types";

type TypingIndicatorProps = {
  typingUsers: TypingUser[];
};

const formatTypingText = (users: TypingUser[]): string | null => {
  const count = users.length;
  if (count === 0) return null;

  if (count === 1) {
    const name = users[0].username || "Someone";
    return `${name} is typing...`;
  }

  if (count === 2) {
    const name1 = users[0].username || "Someone";
    const name2 = users[1].username || "Someone";
    return `${name1} and ${name2} are typing...`;
  }

  return `${count} people are typing...`;
};

export const TypingIndicator = ({ typingUsers }: TypingIndicatorProps) => {
  const text = useMemo(() => formatTypingText(typingUsers), [typingUsers]);

  if (!text) return null;

  return (
    <div className="text-center text-xs text-muted-foreground">
      <span>{text}</span>
    </div>
  );
};
