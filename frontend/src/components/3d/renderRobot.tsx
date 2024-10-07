import { useEffect, useRef } from "react";
import { IRobot } from "@/types/Interfaces";
import { useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import URDFLoader from "urdf-loader";
import * as THREE from "three";

export const renderRobot = (
  robot: IRobot | undefined,
  setSelectedId: (id: string | null) => void
) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useThree();

  if (!robot) {
    console.error("Robot object is undefined");
    return null;
  }

  const { robot_reference } = robot;

  if (!robot_reference) {
    console.error("Robot reference is undefined:", robot);
    return (
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  }

  const isURDF = robot_reference.toLowerCase().endsWith("urdf");
  const isGLTF =
    robot_reference.toLowerCase().endsWith("gltf") ||
    robot_reference.toLowerCase().endsWith("glb");

  const gltf = isGLTF
    ? useLoader(
        GLTFLoader,
        `/models/${robot_reference}`,
        (loader) => {
          loader.manager.onProgress = (_, loaded, total) => {
            const progress = (loaded / total) * 100;
            console.log(`GLTF loading progress: ${progress.toFixed(2)}%`);
          };
        },
        (error) => {
          console.error(
            "Error loading GLTF model:",
            error instanceof Error ? error.message : error
          );
        }
      )
    : null;

  useEffect(() => {
    if (isURDF && groupRef.current) {
      const loader = new URDFLoader();
      loader.load(
        `/models/${robot_reference}`,
        (urdfRobot) => {
          groupRef.current?.add(urdfRobot);
        },
        (xhr) => {
          const progress = (xhr.loaded / xhr.total) * 100;
          console.log(`URDF loading progress: ${progress.toFixed(2)}%`);
        },
        (error) => {
          console.error("Error loading URDF:", error);
        }
      );
    }

    return () => {
      if (groupRef.current) {
        groupRef.current.clear();
      }
    };
  }, [robot_reference, isURDF, scene]);

  if (isGLTF && gltf) {
    return <primitive object={gltf.scene} />;
  }

  return (
    <group
      ref={groupRef}
      onClick={(event) => {
        event.stopPropagation();
        setSelectedId(robot.id);
      }}
    >
      {!isURDF && !isGLTF && (
        <mesh>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="pink" />
        </mesh>
      )}
      {(isURDF || isGLTF) && (
        <mesh>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="yellow" />
        </mesh>
      )}
    </group>
  );
};
