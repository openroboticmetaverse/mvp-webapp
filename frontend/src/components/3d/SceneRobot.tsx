import React, { memo } from "react";
import { IRobot } from "@/types/Interfaces";
import { renderRobot } from "./renderRobot";

interface SceneRobotProps {
  robot: IRobot;
  setSelectedId: (id: string | null) => void;
}

const SceneRobot: React.FC<SceneRobotProps> = memo(
  ({ robot, setSelectedId }) => {
    return (
      <primitive object={robot} onClick={() => setSelectedId(robot.id)}>
        {renderRobot(robot, setSelectedId)}
      </primitive>
    );
  }
);

export default SceneRobot;
