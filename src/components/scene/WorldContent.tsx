import { useFrame } from "@react-three/fiber";
import { Container, Image, Text } from "@react-three/uikit";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Vector3 } from "three";
import { useChatStore } from "@/stores/chatStore";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";
import { useRemotePlayersStore } from "@/stores/remotePlayersStore";
import {
  useWorldStore,
  type WorldContentItem as WorldContentItemType,
} from "@/stores/worldStore";
import { hasImageContent } from "@/utils/chat";

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const MAX_CONTENT_WIDTH = 200;
const CONTENT_HEIGHT = 1.5;
const CONTENT_OFFSET = new Vector3(-2.5, 0, 0);

const BASE_DIRECTIONS = [
  { position: new Vector3(0, 0, -2), rotation: Math.PI, name: "north" },
  { position: new Vector3(0, 0, 2), rotation: 0, name: "south" },
  { position: new Vector3(2, 0, 0), rotation: Math.PI / 2, name: "east" },
  { position: new Vector3(-2, 0, 0), rotation: -Math.PI / 2, name: "west" },
];

const DIRECTIONS = BASE_DIRECTIONS.flatMap(({ position, rotation, name }) => [
  { position, rotation: [0, rotation, 0] as const, name },
  {
    position,
    rotation: [0, rotation + Math.PI, 0] as const,
    name: `${name}-back`,
  },
]);

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

      if (msg.isOwn) {
        position = localPlayerPosition.clone().add(CONTENT_OFFSET);
        username = localPlayerUsername;
      } else if (msg.sessionId) {
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
      {contentItems.map((item) =>
        DIRECTIONS.map((direction) => (
          <WorldContentItem
            key={`${item.id}-${direction.name}`}
            item={item}
            position={direction.position}
            rotation={direction.rotation}
          />
        )),
      )}
    </>
  );
}

type WorldContentItemProps = {
  item: WorldContentItemType;
  position: Vector3;
  rotation: readonly [number, number, number];
};

/**
 * Component that displays an individual world content item.
 */
function WorldContentItem({ item, position, rotation }: WorldContentItemProps) {
  const elapsedTimeRef = useRef(0);
  const [opacity, setOpacity] = useState(0);
  const [scale, setScale] = useState(0.8);

  const TRANSITION_DURATION = 0.3;

  useFrame((_, delta) => {
    if (elapsedTimeRef.current < TRANSITION_DURATION) {
      elapsedTimeRef.current += delta;
      const progress = Math.min(
        elapsedTimeRef.current / TRANSITION_DURATION,
        1,
      );

      const easedProgress = 1 - (1 - progress) ** 3;

      setOpacity(easedProgress);
      setScale(0.8 + easedProgress * 0.2);
    }
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Suspense fallback={null}>
        <Container
          borderRadius={8}
          padding={8}
          backgroundColor="rgba(0, 0, 0, 0.75)"
          maxWidth={MAX_CONTENT_WIDTH}
          flexDirection="column"
          gap={4}
          alignItems="center"
          opacity={opacity}
          fontFamilies={{
            notoSans: {
              bold: "/fonts/NotoSansJP-Bold.json",
            },
          }}
        >
          <Image
            src={item.image.url}
            width={MAX_CONTENT_WIDTH - 16}
            borderRadius={4}
          />
          {item.username && (
            <Text
              fontSize={5}
              color="rgba(255, 255, 255, 0.7)"
              textAlign="center"
            >
              Shared by {item.username} at {formatTime(item.createdAt)}
            </Text>
          )}
        </Container>
      </Suspense>
    </group>
  );
}
