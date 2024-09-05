import React from "react";
import { CustomObject3DProps } from "./CustomObject3D";
import CustomObject3D from "./CustomObject3D";

type PrimitiveShapeProps = Omit<CustomObject3DProps, "children"> & {
  shape: "sphere" | "cube" | "cylinder" | "cone" | "torus";
  isSelected?: boolean;
};

const PrimitiveShape: React.FC<PrimitiveShapeProps> = ({
  shape,
  isSelected,
  ...props
}) => {
  const getGeometry = () => {
    switch (shape) {
      case "sphere":
        return <sphereGeometry args={[1, 32, 32]} />;
      case "cube":
        return <boxGeometry args={[1, 1, 1]} />;
      case "cylinder":
        return <cylinderGeometry args={[1, 1, 2, 32]} />;
      case "cone":
        return <coneGeometry args={[1, 2, 32]} />;
      case "torus":
        return <torusGeometry args={[1, 0.4, 16, 100]} />;
    }
  };

  return (
    <CustomObject3D {...props}>
      <mesh>
        {getGeometry()}
        <meshMatcapMaterial color={isSelected ? "blue" : "cyan"} />
      </mesh>
    </CustomObject3D>
  );
};

export default PrimitiveShape;
