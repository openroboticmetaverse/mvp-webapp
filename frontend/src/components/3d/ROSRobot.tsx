import React, { useRef, useEffect, useCallback } from "react";
import { ThreeEvent } from "@react-three/fiber";
import { useLoader } from "@react-three/drei";
import URDFLoader from "three/examples/jsm/loaders/URDFLoader";
import * as THREE from "three";

interface ROSRobotProps {
  urdfUrl: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  jointStates?: Record<string, number>;
  onClick?: (event: ThreeEvent<MouseEvent>) => void;
  id?: string;
}

/**
 * ROSRobot component for loading and animating URDF robots
 */
const ROSRobot: React.FC<ROSRobotProps> = ({
  urdfUrl,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  jointStates = {},
  onClick,
  id,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const robotRef = useRef<THREE.Group | null>(null);

  // Load URDF model
  const urdf = useLoader(URDFLoader, urdfUrl);

  useEffect(() => {
    if (urdf) {
      robotRef.current = urdf;
    }
  }, [urdf]);

  // Update transform
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(...position);
      groupRef.current.rotation.set(...rotation);
      groupRef.current.scale.set(...scale);
    }
  }, [position, rotation, scale]);

  // Update joint states
  useEffect(() => {
    if (robotRef.current) {
      Object.entries(jointStates).forEach(([jointName, angle]) => {
        robotRef.current?.traverse((child) => {
          if (child.isJoint && child.name === jointName) {
            child.rotation.y = angle;
          }
        });
      });
    }
  }, [jointStates]);

  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      onClick?.(event);
    },
    [onClick]
  );

  return (
    <group ref={groupRef} onClick={handleClick} userData={{ id }}>
      {urdf ? (
        <primitive object={urdf} />
      ) : (
        <mesh>
          <sphereGeometry args={[1, 32]} />
          <meshStandardMaterial color="blue" />
        </mesh>
      )}
    </group>
  );
};

export default ROSRobot;
