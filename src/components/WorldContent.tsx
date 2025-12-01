import { useFrame } from "@react-three/fiber";
import { Container, Image, Text } from "@react-three/uikit";
import { Suspense, useEffect, useMemo, useRef } from "react";
import type { Object3D } from "three";
import { Vector3 } from "three";
import { useChatStore } from "@/stores/chatStore";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";
import { useRemotePlayersStore } from "@/stores/remotePlayersStore";
import {
  useWorldStore,
  type WorldContentItem as WorldContentItemType,
} from "@/stores/worldStore";
import { hasImageContent } from "@/utils/chat";

const MAX_CONTENT_WIDTH = 200;
const CONTENT_HEIGHT = 0.5;
const CONTENT_OFFSET = new Vector3(0, 0, 0.5);

/**
 * Component that displays image content fixed at world coordinates.
 * Placed at the player's position when the content is sent and displayed for 1 minute.
 */
export function WorldContent() {
  const messages = useChatStore((state) => state.messages);
  const remotePlayers = useRemotePlayersStore((state) => state.players);
  const localPlayerPosition = useLocalPlayerStore((state) => state.position);
  const localPlayerUsername = useLocalPlayerStore((state) => state.username);

  const contentItems = useWorldStore((state) => state.contentItems);
  const addContentItem = useWorldStore((state) => state.addContentItem);

  const processedMessageIds = useRef<Set<string>>(new Set());

  const contentMessages = useMemo(() => {
    return messages.filter(hasImageContent);
  }, [messages]);

  useEffect(() => {
    for (const msg of contentMessages) {
      if (processedMessageIds.current.has(msg.id)) {
        continue;
      }

      let position: Vector3 | null = null;
      let username: string | undefined;

      if (msg.direction === "outgoing") {
        position = localPlayerPosition.clone().add(CONTENT_OFFSET);
        username = localPlayerUsername;
      } else {
        const player = remotePlayers[msg.sessionId];
        if (player?.position) {
          position = player.position.clone().add(CONTENT_OFFSET);
          username = msg.username || player.username;
        }
      }

      if (position && msg.image) {
        position.y = CONTENT_HEIGHT;
        addContentItem({
          id: msg.id,
          position,
          image: msg.image,
          username,
        });
        processedMessageIds.current.add(msg.id);
      }
    }
  }, [
    contentMessages,
    remotePlayers,
    localPlayerPosition,
    localPlayerUsername,
    addContentItem,
  ]);

  return (
    <>
      {contentItems.map((item) => (
        <WorldContentItem key={item.id} item={item} />
      ))}
    </>
  );
}

type WorldContentItemProps = {
  item: WorldContentItemType;
};

/**
 * Component that displays an individual world content item.
 */
function WorldContentItem({ item }: WorldContentItemProps) {
  const ref = useRef<Object3D>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.lookAt(state.camera.position);
    }
  });

  return (
    <group ref={ref} position={item.position}>
      <Suspense fallback={null}>
        <Container
          borderRadius={8}
          padding={8}
          backgroundColor="rgba(0, 0, 0, 0.75)"
          maxWidth={MAX_CONTENT_WIDTH}
          flexDirection="column"
          gap={4}
          alignItems="center"
          fontFamilies={{
            notoSans: {
              bold: "/fonts/NotoSansJP-Bold.json",
            },
          }}
        >
          {item.username && (
            <Text
              fontSize={5}
              color="rgba(255, 255, 255, 0.8)"
              textAlign="center"
            >
              {item.username}
            </Text>
          )}
          <Image
            src={item.image.url}
            width={MAX_CONTENT_WIDTH - 16}
            borderRadius={4}
          />
          {item.image.prompt && (
            <Text
              fontSize={5}
              color="rgba(255, 255, 255, 0.7)"
              wordBreak="break-word"
              textAlign="center"
            >
              {item.image.prompt}
            </Text>
          )}
        </Container>
      </Suspense>
    </group>
  );
}
