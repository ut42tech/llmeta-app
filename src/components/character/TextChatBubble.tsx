"use client";

import { useChat } from "@livekit/components-react";
import { useFrame } from "@react-three/fiber";
import { Container, Text } from "@react-three/uikit";
import { Suspense, useMemo, useRef } from "react";
import type { Object3D } from "three";
import type { ChatMessage } from "@/types/chat";

const TEXT_DISPLAY_DURATION_MS = 10000;
const MAX_TEXT_MESSAGES_TO_SHOW = 3;
const MAX_BUBBLE_WIDTH = 200;

type TextChatBubbleProps = {
  sessionId: string;
};

/**
 * Filter messages that are recent and contain text content
 */
function filterRecentTextMessages(
  messages: ChatMessage[],
  sessionId: string,
  durationMs: number,
): ChatMessage[] {
  const cutoff = Date.now() - durationMs;
  return messages
    .filter(
      (msg) =>
        msg.sentAt > cutoff && msg.content && msg.sessionId === sessionId,
    )
    .slice(-MAX_TEXT_MESSAGES_TO_SHOW);
}

/**
 * Component that displays player's text chat above the avatar's head.
 * Text is displayed for 10 seconds.
 * Content such as images is displayed fixed in the world by the WorldContent component.
 */
export function TextChatBubble({ sessionId }: TextChatBubbleProps) {
  const ref = useRef<Object3D>(null);
  const { chatMessages } = useChat();

  // Transform LiveKit chat messages to our ChatMessage format
  const messages: ChatMessage[] = useMemo(() => {
    return chatMessages.map((msg) => {
      const isLocal = msg.from?.isLocal ?? false;
      let content = msg.message;

      // Try to parse as JSON for image messages
      try {
        const parsed = JSON.parse(msg.message) as { text?: string };
        if (parsed.text !== undefined) {
          content = parsed.text;
        }
      } catch {
        // Not JSON, use as-is
      }

      return {
        id: `${msg.timestamp}-${msg.from?.identity || "unknown"}`,
        sessionId: msg.from?.identity || "unknown",
        username: msg.from?.name || undefined,
        content,
        direction: isLocal ? "outgoing" : "incoming",
        status: "sent",
        sentAt: msg.timestamp,
      };
    });
  }, [chatMessages]);

  const recentTextMessages = useMemo(() => {
    return filterRecentTextMessages(
      messages,
      sessionId,
      TEXT_DISPLAY_DURATION_MS,
    );
  }, [messages, sessionId]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.lookAt(state.camera.position);
    }
  });

  if (recentTextMessages.length === 0) return null;

  return (
    <group ref={ref} position-y={2.5}>
      <Suspense fallback={null}>
        <Container
          flexDirection="column"
          gap={4}
          alignItems="center"
          fontFamilies={{
            notoSans: {
              bold: "/fonts/NotoSansJP-Bold.json",
            },
          }}
        >
          {recentTextMessages.map((message) => (
            <TextMessageBubble key={message.id} content={message.content} />
          ))}
        </Container>
      </Suspense>
    </group>
  );
}

/**
 * Component that displays an individual text message.
 */
function TextMessageBubble({ content }: { content: string }) {
  return (
    <Container
      borderRadius={8}
      paddingX={8}
      paddingY={6}
      backgroundColor="rgba(0, 0, 0, 0.75)"
      maxWidth={MAX_BUBBLE_WIDTH}
      flexDirection="column"
      alignItems="center"
    >
      <Text
        fontSize={6}
        color="white"
        wordBreak="break-word"
        textAlign="center"
      >
        {content}
      </Text>
    </Container>
  );
}
