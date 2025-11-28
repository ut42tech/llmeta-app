import { useFrame } from "@react-three/fiber";
import { Container, Text } from "@react-three/uikit";
import { Suspense, useMemo, useRef } from "react";
import type { Object3D } from "three";
import { useChatStore } from "@/stores/chatStore";
import { filterTextMessages } from "@/utils/chat";

const TEXT_DISPLAY_DURATION_MS = 10000;
const MAX_TEXT_MESSAGES_TO_SHOW = 3;
const MAX_BUBBLE_WIDTH = 200;

type TextChatBubbleProps = {
  sessionId: string;
};

/**
 * Component that displays player's text chat above the avatar's head.
 * Text is displayed for 10 seconds.
 * Content such as images is displayed fixed in the world by the WorldContent component.
 */
export function TextChatBubble({ sessionId }: TextChatBubbleProps) {
  const ref = useRef<Object3D>(null);
  const messages = useChatStore((state) => state.messages);

  const recentTextMessages = useMemo(() => {
    return filterTextMessages(messages, TEXT_DISPLAY_DURATION_MS)
      .filter((msg) => msg.sessionId === sessionId)
      .slice(-MAX_TEXT_MESSAGES_TO_SHOW);
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
