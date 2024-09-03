import React, { forwardRef, useMemo, useEffect, useRef } from "react";
import { Vector3, Euler } from "three";
import { GeometricObject } from "../interfaces/SceneInterfaces";
import * as THREE from "three";
import { useSceneStore } from "../stores/SceneStore";

interface GeometricObjectProps extends GeometricObject {
  onClick: (event: React.MouseEvent) => void;
  onPointerMissed: (event: React.MouseEvent) => void;
  onContextMenu: (event: React.MouseEvent) => void;
  selected: boolean;
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
      onClick,
      onPointerMissed,
      onContextMenu,
      selected,
    },
    ref
  ) => {
    const localRef = useRef<THREE.Mesh>(null);

    useEffect(() => {
      if (localRef.current) {
        localRef.current.position.set(...position);
        localRef.current.rotation.set(...orientation);
        localRef.current.scale.set(...scale);
      }
    }, [position, orientation, scale]);

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
        ref={(el) => {
          localRef.current = el;
          if (typeof ref === "function") {
            ref(el);
          } else if (ref) {
            ref.current = el;
          }
        }}
        onClick={onClick}
        onPointerMissed={onPointerMissed}
        onContextMenu={onContextMenu}
        name={name}
      >
        {GeometryComponent}
        <meshStandardMaterial
          color={selected ? "#ff6080" : color}
          emissive={selected ? 0x555555 : undefined}
        />
      </mesh>
    );
  }
);

export default React.memo(GeometricObjectComponent);
