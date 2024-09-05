import React, { useRef, useState, ReactNode } from "react";
import { extend, ThreeEvent } from "@react-three/fiber";
import { TransformControls } from "@react-three/drei";
import * as THREE from "three";

extend({ TransformControls });

export type CustomObject3DProps = {
  children: ReactNode;
  position: [number, number, number];
  sceneId: string;
  name: string;
};

const CustomObject3D: React.FC<CustomObject3DProps> = ({
  children,
  position,
  sceneId,
  name,
}) => {
  const objectRef = useRef<THREE.Group>(null);
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    setIsSelected(!isSelected);
  };

  return (
    <>
      <group
        ref={objectRef}
        position={position}
        onClick={handleClick}
        userData={{ sceneId, name }}
      >
        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(child, { isSelected } as {
                isSelected: boolean;
              })
            : child
        )}
      </group>
      {isSelected && objectRef.current && (
        <TransformControls
          object={objectRef.current}
          mode="translate"
          size={0.7}
        />
      )}
    </>
  );
};

export default CustomObject3D;
