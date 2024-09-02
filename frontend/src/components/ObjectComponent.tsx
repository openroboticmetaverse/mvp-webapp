import React from "react";
import { Object, Robot } from "../interfaces/SceneInterfaces";
import RobotComponent from "./RobotComponents";

import { Color } from "three";

interface ObjectComponentProps extends Object {
  color: Color;
}

const ObjectComponent: React.FC<ObjectComponentProps> = (props) => {
  if ("type_name" in props) {
    return <RobotComponent {...(props as Robot)} />;
  } else if ("color" in props) {
    console.log("Base Object Selected");
    return (
      <mesh
        position={props.position}
        rotation={props.orientation}
        scale={props.scale}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={props.color} />
      </mesh>
    );
  } else {
    // Default Object rendering
    return (
      <mesh
        position={props.position}
        rotation={props.orientation}
        scale={props.scale}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="white" />
      </mesh>
    );
  }
};

export default ObjectComponent;
