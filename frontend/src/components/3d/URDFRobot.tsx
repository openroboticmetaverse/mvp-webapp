import React, { useRef, useEffect, useMemo, Suspense, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { LoaderUtils } from "three";
import { XacroLoader } from "xacro-parser";
import URDFLoader from "urdf-loader";
import ROSLIB from "roslib";
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
 * ROS configuration interface
 */
interface ROSConfig {
  url: string;
  port: string;
  topicName?: string;
  messageType?: string;
}

/**
 * Joint mapping configurations for different robot types
 */
const JOINT_MAPPINGS: Record<string, Record<string, string>> = {
  sawyer: {
    // Map from Panda joints to Sawyer joints
    panda_joint0: "right_j0",
    panda_joint1: "right_j1",
    panda_joint2: "right_j2",
    panda_joint3: "right_j3",
    panda_joint4: "right_j4",
    panda_joint5: "right_j5",
    panda_joint6: "right_j6",
  },
  panda: {
    // Identity mapping for Panda
    panda_joint0: "panda_joint0",
    panda_joint1: "panda_joint1",
    panda_joint2: "panda_joint2",
    panda_joint3: "panda_joint3",
    panda_joint4: "panda_joint4",
    panda_joint5: "panda_joint5",
    panda_joint6: "panda_joint6",
  },
};

/**
 * Map joint names based on robot type
 */
const mapJointNames = (
  jointStates: Record<string, number>,
  robotType: string
): Record<string, number> => {
  const mapping = JOINT_MAPPINGS[robotType];
  if (!mapping) return jointStates;

  const mappedStates: Record<string, number> = {};

  Object.entries(jointStates).forEach(([joint, value]) => {
    // Find the corresponding mapped joint name
    const mappedJoint = Object.entries(mapping).find(
      ([from, to]) => to === joint || from === joint
    );

    if (mappedJoint) {
      // Use the appropriate joint name based on robot type
      const targetJoint =
        robotType === "sawyer" ? mappedJoint[1] : mappedJoint[0];
      mappedStates[targetJoint] = value;
    } else {
      // Keep original joint name if no mapping exists
      mappedStates[joint] = value;
    }
  });

  return mappedStates;
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
  rosConfig?: ROSConfig;
}

/**
 * Joint state message interface
 */
interface JointStateMessage {
  name: string[];
  position: number[];
  velocity: number[];
  effort: number[];
}

/**
 * Fallback component shown while loading
 */
const LoadingFallback: React.FC = React.memo(() => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="gray" wireframe />
  </mesh>
));

/**
 * Error fallback component
 */
const ErrorFallback: React.FC = React.memo(() => (
  <mesh>
    <sphereGeometry args={[0.5, 16]} />
    <meshStandardMaterial color="red" />
  </mesh>
));

/**
 * Connection status indicator
 */
const ConnectionIndicator: React.FC<{ isConnected: boolean }> = React.memo(
  ({ isConnected }) => (
    <mesh position={[0, 2, 0]} scale={0.2}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color={isConnected ? "#00ff00" : "#ff0000"} />
    </mesh>
  )
);

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
 * ROS Connection handler component
 */
const ROSConnection: React.FC<{
  config: ROSConfig;
  onJointStates: (states: Record<string, number>) => void;
  onConnectionChange: (connected: boolean) => void;
  id: string;
}> = React.memo(({ config, onJointStates, onConnectionChange, id }) => {
  useEffect(() => {
    const ros = new ROSLIB.Ros({
      url: `ws://${config.url}:${config.port}`,
    });

    let subscriber: ROSLIB.Topic | null = null;

    ros.on("connection", () => {
      errorLoggingService.info("Connected to ROS bridge", { id });
      onConnectionChange(true);

      subscriber = new ROSLIB.Topic({
        ros: ros,
        name: config.topicName || "/joint_states",
        messageType: config.messageType || "sensor_msgs/JointState",
      });

      subscriber.subscribe((message: JointStateMessage) => {
        try {
          const jointStates: Record<string, number> = {};
          message.name.forEach((name, index) => {
            jointStates[name] = message.position[index];
          });
          onJointStates(jointStates);
        } catch (error) {
          errorLoggingService.error(
            "Error processing joint state message",
            error as Error,
            { id, message }
          );
        }
      });
    });

    ros.on("error", (error) => {
      errorLoggingService.error("ROS connection error", error, {
        id,
        url: config.url,
        port: config.port,
      });
      onConnectionChange(false);
    });

    ros.on("close", () => {
      errorLoggingService.info("ROS connection closed", { id });
      onConnectionChange(false);
    });

    return () => {
      if (subscriber) {
        subscriber.unsubscribe();
      }
      ros.close();
    };
  }, [config, onJointStates, onConnectionChange, id]);

  return null;
});

/**
 * Robot model component that handles the URDF model and joint animations
 */
const RobotModel: React.FC<{
  robotUrl: string;
  initialJointStates?: Record<string, number>;
  jointStates: Record<string, number>;
  type: string;
  id: string;
}> = React.memo(({ robotUrl, initialJointStates, jointStates, type, id }) => {
  const robotRef = useRef<THREE.Object3D | null>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Map joint states based on robot type
  const mappedJointStates = useMemo(
    () => mapJointNames(jointStates, type),
    [jointStates, type]
  );

  // Apply mapped joint states in animation frame
  useFrame(() => {
    if (robotRef.current) {
      Object.entries(mappedJointStates).forEach(([joint, value]) => {
        try {
          (robotRef.current as any).setJointValue(joint, value);
        } catch (error) {
          // Don't log every frame error
          console.debug(`Joint not found: ${joint}`);
        }
      });
    }
  });

  // Load the robot with mapped initial joint states
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

              // Apply mapped initial joint states
              if (initialJointStates) {
                const mappedInitialStates = mapJointNames(
                  initialJointStates,
                  type
                );
                Object.entries(mappedInitialStates).forEach(
                  ([joint, value]) => {
                    try {
                      robot.setJointValue(joint, value);
                    } catch (error) {
                      errorLoggingService.error(
                        `Failed to set initial joint value`,
                        error as Error,
                        { id, joint, value, robotType: type }
                      );
                    }
                  }
                );
              }

              robotRef.current = robot;

              if (groupRef.current) {
                while (groupRef.current.children.length > 0) {
                  groupRef.current.remove(groupRef.current.children[0]);
                }
                groupRef.current.add(robot);
              }

              errorLoggingService.info(`Robot loaded successfully`, {
                id,
                robotType: type,
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
          (error) => {
            errorLoggingService.error(`Failed to load Xacro`, error, {
              id,
              robotUrl,
            });
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
      }
    };
  }, [robotUrl, id, initialJointStates, type]);

  return <group ref={groupRef} />;
});
/**
 * Main URDFRobot component
 */
const URDFRobot: React.FC<URDFRobotProps> = ({
  type,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  id = "urdf-robot",
  initialJointStates,
  rosConfig,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [jointStates, setJointStates] = useState<Record<string, number>>(
    initialJointStates || {}
  );

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
          jointStates={jointStates}
          type={type}
          id={id}
        />
        {rosConfig && (
          <ROSConnection
            config={rosConfig}
            onJointStates={setJointStates}
            onConnectionChange={setIsConnected}
            id={id}
          />
        )}
        {/* 
        <ConnectionIndicator isConnected={isConnected} /> */}
      </Suspense>
    </group>
  );
};

export default React.memo(URDFRobot);
