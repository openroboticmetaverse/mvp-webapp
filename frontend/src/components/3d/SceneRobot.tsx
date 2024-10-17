import React, {
  useCallback,
  useMemo,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
} from "react";
import { ThreeEvent, useLoader, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { IReferenceRobot, IRobot } from "@/types/Interfaces";
import { libraryStore } from "@/stores/library-store";
import * as THREE from "three";
import ErrorBoundary from "../ErrorBoundary";
import { errorLoggingService } from "@/services/error-logging-service";
import { webSocketManager } from "@/services/websocket-manager";

interface SceneRobotProps {
  robot: IRobot;
  setSelectedId: (id: string | null) => void;
}

const SceneRobot = forwardRef<THREE.Group, SceneRobotProps>(
  ({ robot, setSelectedId }, ref) => {
    const groupRef = useRef<THREE.Group>(null);

    const referenceRobotId = useMemo(() => {
      if (
        typeof robot.robot_reference === "string" ||
        typeof robot.robot_reference === "number"
      ) {
        return robot.robot_reference;
      } else if (
        robot.robot_reference &&
        typeof robot.robot_reference === "object" &&
        "id" in robot.robot_reference
      ) {
        return (robot.robot_reference as { id: string | number }).id;
      } else {
        errorLoggingService.error(
          "Invalid robot_reference type",
          new Error("Invalid robot_reference type"),
          { robotId: robot.id, robotReference: robot.robot_reference }
        );
        return null;
      }
    }, [robot.robot_reference, robot.id]);

    const referenceRobot = useMemo(() => {
      if (referenceRobotId !== null) {
        const reference = libraryStore.getReferenceRobotById(referenceRobotId);
        if (!reference) {
          errorLoggingService.error(
            `Reference robot not found`,
            new Error(`Reference robot not found for id: ${referenceRobotId}`),
            {
              robotId: robot.id,
              referenceRobotId,
              availableIds: libraryStore.referenceRobots.map((r) => r.id),
              libraryStoreState: libraryStore.state,
              robotCount: libraryStore.referenceRobots.length,
            }
          );
        }
        return reference;
      }
      return null;
    }, [referenceRobotId, robot.id]);

    useImperativeHandle(ref, () => groupRef.current!, []);

    const handleClick = useCallback(
      (event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        setSelectedId(robot.id);
      },
      [robot.id, setSelectedId]
    );

    const RobotModel = useMemo(() => {
      if (!referenceRobot) {
        return () => <FallbackModel />;
      }

      return () => {
        try {
          if (
            referenceRobot.file_type.toLowerCase() === "gltf" ||
            referenceRobot.file_type.toLowerCase() === "glb"
          ) {
            return (
              <GLTFModel
                file={referenceRobot.file}
                robot={robot}
                referenceRobot={referenceRobot}
              />
            );
          } else {
            return <FallbackModel />;
          }
        } catch (error) {
          errorLoggingService.error(
            "Error loading robot model:",
            error as Error,
            {
              robotId: robot.id,
              referenceRobotId: referenceRobotId,
              fileType: referenceRobot.file_type,
            }
          );
          return <FallbackModel />;
        }
      };
    }, [referenceRobot, robot.id, referenceRobotId, robot]);

    useEffect(() => {
      if (groupRef.current) {
        groupRef.current.position.set(...robot.position);
        groupRef.current.rotation.set(...robot.orientation);
        groupRef.current.scale.set(...robot.scale);
      }
    }, [robot.position, robot.orientation, robot.scale]);

    return (
      <group ref={groupRef} onClick={handleClick} userData={{ id: robot.id }}>
        <ErrorBoundary fallback={<FallbackModel />}>
          <RobotModel />
        </ErrorBoundary>
      </group>
    );
  }
);

const getFileUrl = (file: string | File | Blob): string => {
  if (typeof file === "string") {
    return file;
  } else if (file instanceof File || file instanceof Blob) {
    return URL.createObjectURL(file);
  } else {
    throw new Error("Invalid file type");
  }
};

interface GLTFModelProps {
  file: string | File | Blob;
  robot: IRobot;
  referenceRobot: IReferenceRobot;
}

const GLTFModel: React.FC<GLTFModelProps> = ({
  file,
  robot,
  referenceRobot,
}) => {
  const gltf = useLoader(GLTFLoader, getFileUrl(file));
  const modelRef = useRef<THREE.Group | null>(null);
  const jointAngles = useRef<Record<string, number>>({});

  // Use the new jointConfig from the parent component
  const jointConfig = useMemo(() => {
    if (referenceRobot && referenceRobot.joint_names) {
      return referenceRobot.joint_names.links.map((name, index) => ({
        name,
        axis: referenceRobot.joint_names.axes[index] as "rx" | "ry" | "rz" | "",
      }));
    }
    return [];
  }, [referenceRobot]);

  useEffect(() => {
    if (gltf.scene) {
      modelRef.current = gltf.scene;
    }
  }, [gltf]);
  webSocketManager.getStatus;

  useEffect(() => {
    if (robot.sim_websocket_url) {
      try {
        webSocketManager.createConnection(robot.id, robot.sim_websocket_url);
        webSocketManager.setOnMessageCallback(robot.id, handleWebSocketMessage);
      } catch (error) {
        errorLoggingService.error(
          `Error setting up WebSocket for robot ${robot.id}`,
          error as Error
        );
      }
    }

    return () => {
      webSocketManager.disconnectAll();
    };
  }, [robot.id, robot.sim_websocket_url]);

  const handleWebSocketMessage = (data: {
    jointPositions: Record<string, number>;
  }) => {
    /* errorLoggingService.info(
      `Received WebSocket data for robot ${robot.id}:`,
      data
    ); */
    if (data && data.jointPositions) {
      jointAngles.current = data.jointPositions;
    } else {
      errorLoggingService.warn(
        `Received unexpected data structure for robot ${robot.id}:`,
        data
      );
    }
  };

  const applyJointAngles = useCallback(
    (
      model: THREE.Object3D,
      config: { name: string; axis: "rx" | "ry" | "rz" | "" }[],
      angles: Record<string, number>
    ) => {
      model.traverse((child) => {
        if (child instanceof THREE.Object3D) {
          const jointConfigItem = config.find(
            (item) => item.name === child.name
          );
          if (jointConfigItem && jointConfigItem.axis !== "") {
            const angle = angles[jointConfigItem.name];
            if (typeof angle === "number") {
              switch (jointConfigItem.axis) {
                case "rx":
                  child.rotation.x = angle;
                  break;
                case "ry":
                  child.rotation.y = angle;
                  break;
                case "rz":
                  child.rotation.z = angle;
                  break;
              }
              /* errorLoggingService.info(
                `Applied rotation to joint ${child.name}: ${angle} on axis ${jointConfigItem.axis}`
              ); */
            } else {
              errorLoggingService.warn(`No angle data for joint ${child.name}`);
            }
          }
        }
      });
    },
    []
  );

  useFrame(() => {
    if (
      modelRef.current &&
      webSocketManager.getStatus(robot.id) === "connected"
    ) {
      applyJointAngles(modelRef.current, jointConfig, jointAngles.current);
    }
  });

  return <primitive object={gltf.scene} />;
};

const FallbackModel: React.FC = () => (
  <mesh>
    <sphereGeometry args={[1, 32]} />
    <meshMatcapMaterial color="blue" />
  </mesh>
);

export default SceneRobot;
