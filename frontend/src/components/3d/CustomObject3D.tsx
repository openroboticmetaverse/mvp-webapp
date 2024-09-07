import React, { useCallback, useRef, useState, useEffect } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { TransformControls } from "@react-three/drei";
import * as THREE from "three";

interface CustomObject3DProps {
  children: React.ReactNode;
  position: [number, number, number];
  sceneId?: string;
  name?: string;
  onSelect?: (isSelected: boolean) => void;
  transformControlsMode?: "translate" | "rotate" | "scale";
}

const useSelectable = (
  initialState = false,
  onSelect?: (isSelected: boolean) => void
) => {
  const [isSelected, setIsSelected] = useState(initialState);

  const handleSelect = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      setIsSelected((prev) => {
        const newState = !prev;
        onSelect?.(newState);
        return newState;
      });
    },
    [onSelect]
  );

  return [isSelected, handleSelect] as const;
};

const TransformControlsComponent: React.FC<{
  object: THREE.Object3D;
  mode: "translate" | "rotate" | "scale";
}> = React.memo(({ object, mode }) => (
  <TransformControls object={object} mode={mode} size={0.7} />
));

const CustomObject3D: React.FC<CustomObject3DProps> = React.memo(
  ({
    children,
    position,
    sceneId,
    name,
    onSelect,
    transformControlsMode = "translate",
    ...props
  }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [isSelected, handleSelect] = useSelectable(false, onSelect);

    useEffect(() => {
      if (meshRef.current) {
        meshRef.current.userData = { sceneId, name };
      }
    }, [sceneId, name]);

    useEffect(() => {
      if (meshRef.current && meshRef.current.material) {
        (meshRef.current.material as THREE.MeshStandardMaterial).color.setHex(
          isSelected ? 0x0000ff : 0x00ffff
        );
      }
    }, [isSelected]);

    useFrame(() => {
      if (meshRef.current && isSelected) {
        // Perform any necessary updates for selected objects
        // This runs every frame, so keep it light
      }
    });

    return (
      <>
        <mesh
          ref={meshRef}
          position={position}
          onClick={handleSelect}
          {...props}
        >
          {children}
        </mesh>
        {isSelected && meshRef.current && (
          <TransformControlsComponent
            object={meshRef.current}
            mode={transformControlsMode}
          />
        )}
      </>
    );
  }
);

CustomObject3D.displayName = "CustomObject3D";

export default CustomObject3D;
