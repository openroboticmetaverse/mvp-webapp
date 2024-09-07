import React, { useMemo } from "react";
import { Sphere, Box, Cylinder, Cone, Torus } from "@react-three/drei";
import CustomObject3D from "./CustomObject3D";
import * as THREE from "three";

interface PrimitiveShapeProps {
  shape: "sphere" | "cube" | "cylinder" | "cone" | "torus";
  isSelected?: boolean;
  position: [number, number, number];
  sceneId?: string;
  name?: string;
  color?: string;
}

const PrimitiveShape: React.FC<PrimitiveShapeProps> = ({
  shape,
  isSelected = false,
  position,
  color,
  ...props
}) => {
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color }),
    [color]
  );

  const getGeometry = () => {
    const sharedProps = { material };
    switch (shape) {
      case "sphere":
        return <Sphere args={[1, 32, 32]} {...sharedProps} />;
      case "cube":
        return <Box args={[1, 1, 1]} {...sharedProps} />;
      case "cylinder":
        return <Cylinder args={[1, 1, 2, 32]} {...sharedProps} />;
      case "cone":
        return <Cone args={[1, 2, 32]} {...sharedProps} />;
      case "torus":
        return <Torus args={[1, 0.4, 16, 100]} {...sharedProps} />;
      default:
        return null;
    }
  };

  return (
    <CustomObject3D position={position} {...props}>
      {getGeometry()}
    </CustomObject3D>
  );
};

export default PrimitiveShape;
