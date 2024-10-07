import { useEffect, useRef } from "react";
import { IRobot } from "@/types/Interfaces";
import { useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import URDFLoader from "urdf-loader";
import * as THREE from "three";

/**
 * Renders a 3D representation of a robot based on its reference type.
 * Supports URDF and GLTF formats, with a fallback to a placeholder box.
 *
 * @param {IRobot} robot - The robot data to render.
 * @returns {JSX.Element | null} A JSX element representing the robot mesh or null if data is invalid.
 */
export const renderRobot = (robot: IRobot | undefined) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useThree();

  // Check if robot object is defined
  if (!robot) {
    console.error("Robot object is undefined");
    return null;
  }

  const { robot_reference } = robot;

  // Check if robot_reference is defined
  if (!robot_reference) {
    console.error("Robot reference is undefined:", robot);
    return (
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  }

  // Determine the robot type from the reference
  const isURDF = robot_reference.toLowerCase().endsWith("urdf");
  const isGLTF =
    robot_reference.toLowerCase().endsWith("gltf") ||
    robot_reference.toLowerCase().endsWith("glb");

  // Load GLTF model if applicable
  const gltf = isGLTF
    ? useLoader(
        GLTFLoader,
        `/models/${robot_reference}`,
        undefined,
        (error) => {
          console.error("Error loading GLTF model:", error);
        }
      )
    : null;

  useEffect(() => {
    if (isURDF && groupRef.current) {
      // Load URDF
      const loader = new URDFLoader();
      loader.load(
        `/models/${robot_reference}`,
        (urdfRobot) => {
          if (groupRef.current) {
            groupRef.current.add(urdfRobot);
          }
        },
        (xhr) => {
          console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
        },
        (error) => {
          console.error("Error loading URDF:", error);
        }
      );
    }

    // Cleanup function
    return () => {
      if (groupRef.current) {
        while (groupRef.current.children.length) {
          groupRef.current.remove(groupRef.current.children[0]);
        }
      }
    };
  }, [robot_reference, isURDF, scene]);

  if (isGLTF && gltf) {
    return <primitive object={gltf.scene} />;
  }

  return (
    <group ref={groupRef}>
      {!isURDF && !isGLTF && (
        // Fallback to placeholder box if neither URDF nor GLTF
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      )}
    </group>
  );
};
