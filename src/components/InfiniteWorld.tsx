import { Text } from "@react-three/drei";
import { BvhPhysicsBody, PrototypeBox } from "@react-three/viverse";
import {
  GRID_CELL_SIZE,
  HALF_GRID_CELL_SIZE,
  playerStore,
} from "@/stores/playerStore";
import { worldStore } from "@/stores/worldStore";

export const InfiniteWorld = ({ ...props }) => {
  const gridPosition = playerStore((state) => state.gridPosition);
  const gridSize = worldStore((state) => state.gridSize);
  return (
    <group
      {...props}
      position-x={(-gridSize.x / 2) * GRID_CELL_SIZE + HALF_GRID_CELL_SIZE} // Center the grid
      position-y={-0.5}
      position-z={(-gridSize.y / 2) * GRID_CELL_SIZE + HALF_GRID_CELL_SIZE} // Center the grid
    >
      {Array.from({ length: gridSize.x }, (_, i) => i).map((x) =>
        Array.from({ length: gridSize.y }, (_, j) => j).map((y) => {
          const cellX = x + gridPosition.x - Math.floor(gridSize.x / 2);
          const cellY = y + gridPosition.y - Math.floor(gridSize.y / 2);
          return (
            <group
              key={`${x}-${y}`}
              position={[
                x * GRID_CELL_SIZE + gridPosition.x * GRID_CELL_SIZE,
                0,
                y * GRID_CELL_SIZE + gridPosition.y * GRID_CELL_SIZE,
              ]}
            >
              <BvhPhysicsBody kinematic>
                <PrototypeBox
                  scale={[GRID_CELL_SIZE, 1, GRID_CELL_SIZE]}
                  position={[0, -2, 0]}
                />
              </BvhPhysicsBody>
              <Text
                fontSize={1}
                position-y={-1.49}
                rotation-x={-Math.PI / 2}
                fontWeight={"bold"}
                textAlign="center"
                lineHeight={1}
                receiveShadow
              >
                CELL{"\n"}[{cellX}, {cellY}]
                <meshStandardMaterial color="white" />
              </Text>
            </group>
          );
        }),
      )}
    </group>
  );
};
