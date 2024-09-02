import React from "react";
import ObjectComponent from "./ObjectComponent";
import { Robot } from "../interfaces/SceneInterfaces";

interface RobotComponentProps extends Robot {}

const RobotComponent: React.FC<RobotComponentProps> = (props) => {
  return (
    <ObjectComponent {...props}>
      {/* Add robot-specific rendering logic here */}
      <meshStandardMaterial color="blue" />
    </ObjectComponent>
  );
};

export default RobotComponent;
