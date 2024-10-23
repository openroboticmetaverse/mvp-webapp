import React, { useRef, useEffect, useMemo, Suspense } from "react";
import { useThree } from "@react-three/fiber";
import { LoaderUtils } from "three";
import { XacroLoader } from "xacro-parser";
import URDFLoader from "urdf-loader";
import * as THREE from "three";
import { errorLoggingService } from "@/services/error-logging-service";

/**
 * Package configuration for different robot types
 */
const ROBOT_PACKAGES: { [key: string]: string } = {
  moveit_resources_panda_description:
    "https://raw.githubusercontent.com/moveit/moveit_resources/ros2/panda_description",
  franka_description:
    "https://raw.githubusercontent.com/openroboticmetaverse/robot-description/main/packages/franka_description",
  sawyer:
    "https://raw.githubusercontent.com/openroboticmetaverse/mvp-test/master/assets/models/sawyer_description",
  robotiq_2f_85_gripper_visualization:
    "https://raw.githubusercontent.com/openroboticmetaverse/mvp-test/master/assets/models/robotiq_3f_gripper_visualization",
};

/**
 * Robot model URLs
 */
const ROBOT_URLS: { [key: string]: string } = {
  panda:
    "https://raw.githubusercontent.com/openroboticmetaverse/robot-description/main/packages/franka_description/robots/panda_arm_hand.urdf.xacro",
  sawyer:
    "https://raw.githubusercontent.com/openroboticmetaverse/mvp-test/master/assets/models/sawyer_description/urdf/sawyer_rocksi_arm.urdf.xacro",
};

/**
 * Props for URDFRobot component
 */
interface URDFRobotProps {
  type: keyof typeof ROBOT_URLS;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  id?: string;
  initialJointStates?: Record<string, number>;
}

/**
 * Fallback component shown while the model is loading
 */
const LoadingFallback: React.FC = React.memo(() => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="gray" wireframe />
  </mesh>
));

/**
 * Error boundary fallback component
 */
const ErrorFallback: React.FC = React.memo(() => (
  <mesh>
    <boxGeometry args={[0.5, 0.5, 0.5]} />
    <meshStandardMaterial color="red" />
  </mesh>
));

/**
 * Create configured XacroLoader
 */
const createXacroLoader = (id: string) => {
  const loader = new XacroLoader();
  (loader as any).rospackCommands = {
    find: (pkg: string) => {
      const path = ROBOT_PACKAGES[pkg];
      if (!path) {
        errorLoggingService.warn(`Unknown ROS package: ${pkg}`, { id, pkg });
      }
      return path;
    },
  };
  return loader;
};

/**
 * Create configured URDFLoader
 */
const createURDFLoader = (workingPath: string) => {
  const loader = new URDFLoader();
  loader.workingPath = workingPath;
  loader.packages =
    "https://raw.githubusercontent.com/openroboticmetaverse/robot-description/main/packages";
  return loader;
};

/**
 * Robot model component that handles the URDF model
 */
const RobotModel: React.FC<{
  robotUrl: string;
  initialJointStates?: Record<string, number>;
  id: string;
}> = React.memo(({ robotUrl, initialJointStates, id }) => {
  const robotRef = useRef<THREE.Object3D | null>(null);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const loadRobot = async () => {
      try {
        const response = await fetch(robotUrl);
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const xacroLoader = createXacroLoader(id);
        const workingPath = LoaderUtils.extractUrlBase(robotUrl);
        const urdfLoader = createURDFLoader(workingPath);

        xacroLoader.load(
          robotUrl,
          (xml) => {
            try {
              const robot = urdfLoader.parse(xml);
              robot.rotation.set(-Math.PI / 2, 0, 0);
              robot.scale.set(2, 2, 2);

              // Apply initial joint states if provided
              if (initialJointStates) {
                Object.entries(initialJointStates).forEach(([joint, value]) => {
                  try {
                    robot.setJointValue(joint, value);
                  } catch (error) {
                    errorLoggingService.error(
                      `Failed to set joint value`,
                      error as Error,
                      { id, joint, value }
                    );
                  }
                });
              }

              robotRef.current = robot;

              // Instead of adding to scene, we add to our group
              if (groupRef.current && robot) {
                // Clear any existing robots
                while (groupRef.current.children.length > 0) {
                  groupRef.current.remove(groupRef.current.children[0]);
                }
                groupRef.current.add(robot);
              }

              errorLoggingService.info(`Robot loaded successfully`, {
                id,
                robotType: id,
                jointCount: Object.keys(robot.joints).length,
              });
            } catch (error) {
              errorLoggingService.error(
                `Failed to parse URDF`,
                error as Error,
                { id, robotUrl }
              );
            }
          },
          (progress) => {
            errorLoggingService.debug(`Loading progress`, {
              id,
              progress: Math.round(progress * 100),
            });
          },
          (error: Error) => {
            errorLoggingService.error(`Failed to load Xacro`, error as Error);
          }
        );
      } catch (error) {
        errorLoggingService.error(
          `Failed to fetch robot model`,
          error as Error,
          {
            id,
            robotUrl,
          }
        );
      }
    };

    loadRobot();

    return () => {
      if (groupRef.current) {
        while (groupRef.current.children.length > 0) {
          groupRef.current.remove(groupRef.current.children[0]);
        }
        errorLoggingService.debug(`Robot removed from group`, { id });
      }
    };
  }, [robotUrl, id, initialJointStates]);

  return <group ref={groupRef} />;
});

/**
 * URDFRobot component for loading and displaying URDF robot models
 */
const URDFRobot: React.FC<URDFRobotProps> = ({
  type,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  id = "urdf-robot",
  initialJointStates,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Get robot URL
  const robotUrl = useMemo(() => {
    const url = ROBOT_URLS[type];
    if (!url) {
      errorLoggingService.error(`Unknown robot type: ${type}`, new Error(), {
        id,
        type,
        availableTypes: Object.keys(ROBOT_URLS),
      });
    }
    return url;
  }, [type, id]);

  // Update position when props change
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(...position);
      groupRef.current.rotation.set(...rotation);
      groupRef.current.scale.set(...scale);
    }
  }, [position, rotation, scale]);

  if (!robotUrl) {
    return <ErrorFallback />;
  }

  return (
    <group
      ref={groupRef}
      userData={{ id, type: "URDFRobot" }}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
      receiveShadow
    >
      <Suspense fallback={<LoadingFallback />}>
        <RobotModel
          robotUrl={robotUrl}
          initialJointStates={initialJointStates}
          id={id}
        />
      </Suspense>
    </group>
  );
};

export default React.memo(URDFRobot);
