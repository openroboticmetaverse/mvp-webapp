// frontend/src/components/3d/renderRobot.tsx
import React from "react";
import { RobotData } from "../../api/sceneService";

export const renderRobot = (
  robot: RobotData,
  setSelectedId: (id: string) => void
) => {
  return (
    <mesh
      position={robot.position}
      rotation={robot.orientation}
      scale={robot.scale}
      onClick={() => setSelectedId(robot.id)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
};
