import React, { forwardRef, useMemo } from "react";
import { Vector3, Euler } from "three";
import { GeometricObject } from "../interfaces/SceneInterfaces";
import * as THREE from "three";

interface GeometricObjectProps extends GeometricObject {
  selected: boolean;
  onClick: (event: React.MouseEvent) => void;
}

export const GeometricObjectComponent = forwardRef<
  THREE.Mesh,
  GeometricObjectProps
>(
  (
    {
      id,
      name,
      position,
      orientation,
      scale,
      color,
      shape = "box",
      selected,
      onClick,
    },
    ref
  ) => {
    const GeometryComponent = useMemo(() => {
      switch (shape) {
        case "sphere":
          return <sphereGeometry args={[0.5, 32, 32]} />;
        case "cylinder":
          return <cylinderGeometry args={[0.5, 0.5, 1, 32]} />;
        case "plane":
          return <planeGeometry args={[1, 1]} />;
        case "torus":
          return <torusGeometry args={[0.5, 0.2, 16, 100]} />;
        case "box":
        default:
          return <boxGeometry args={[1, 1, 1]} />;
      }
    }, [shape]);

    return (
      <mesh
        ref={ref}
        position={position}
        rotation={orientation}
        scale={scale}
        onClick={onClick}
        name={name}
      >
        {GeometryComponent}
        <meshStandardMaterial
          color={color}
          emissive={selected ? 0x555555 : undefined}
        />
      </mesh>
    );
  }
);

export default React.memo(GeometricObjectComponent);
