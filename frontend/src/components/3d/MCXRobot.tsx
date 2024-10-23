import React, {
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useState,
  Suspense,
} from "react";
import { ThreeEvent, useLoader, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { errorLoggingService } from "@/services/error-logging-service";

/**
 * Valid rotation axes for joints
 */
type RotationAxis = "rx" | "ry" | "rz" | "";

/**
 * Interface for joint configuration
 */
interface JointConfig {
  name: string;
  axis: RotationAxis;
}

/**
 * WebSocket message format
 */
interface WebSocketMessage {
  jointPositions: Record<string, number>;
}

/**
 * WebSocket configuration interface
 */
interface WebSocketConfig {
  url: string;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

/**
 * Default joint configuration - update names to match your GLTF model's joint names
 */
const DEFAULT_JOINT_CONFIG: JointConfig[] = [
  { name: "Base", axis: "rz" },
  { name: "Link1", axis: "ry" },
  { name: "Link2", axis: "ry" },
  { name: "Link3", axis: "ry" },
  { name: "Link4", axis: "ry" },
  { name: "Link5", axis: "rz" },
];

/**
 * Props for MCXRobot component
 */
interface MCXRobotProps {
  modelUrl: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  jointConfig?: JointConfig[];
  websocketConfig: WebSocketConfig;
  id?: string;
  debug?: boolean;
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
    <sphereGeometry args={[0.5, 16]} />
    <meshStandardMaterial color="red" />
  </mesh>
));

/**
 * Connection status indicator component
 */
const ConnectionIndicator: React.FC<{ isConnected: boolean }> = React.memo(
  ({ isConnected }) => (
    <mesh position={[0, 0, 1.5]} scale={0.1}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color={isConnected ? "#00ff00" : "#ff0000"} />
    </mesh>
  )
);

/**
 * Robot model component that handles the GLTF model and joint animations
 */
const RobotModel: React.FC<{
  gltf: THREE.Group;
  jointConfig: JointConfig[];
  jointStates: Record<string, number>;
  debug?: boolean;
  id: string;
}> = React.memo(({ gltf, jointConfig, jointStates, debug, id }) => {
  const modelRef = useRef<THREE.Group>(gltf.clone());

  useFrame(() => {
    if (modelRef.current) {
      applyJointAngles(modelRef.current, jointConfig, jointStates);
    }
  });

  /**
   * Apply joint angles to the model
   */
  const applyJointAngles = (
    model: THREE.Object3D,
    config: JointConfig[],
    angles: Record<string, number>
  ) => {
    model.traverse((child) => {
      if (child instanceof THREE.Object3D) {
        const jointConfigItem = config.find((item) => item.name === child.name);

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

            if (debug) {
              errorLoggingService.debug(
                `Applied rotation to joint ${child.name}`,
                {
                  robotId: id,
                  jointName: child.name,
                  angle,
                  axis: jointConfigItem.axis,
                }
              );
            }
          }
        }
      }
    });
  };

  return <primitive object={modelRef.current} />;
});

/**
 * MCXRobot component for loading and animating GLTF robots with joint states
 * received via WebSocket
 */
const MCXRobot: React.FC<MCXRobotProps> = ({
  modelUrl,
  position = [0, 0, 0],
  rotation = [-1.5707963267948966, 0, 0],
  scale = [1, 1, 1],
  jointConfig = DEFAULT_JOINT_CONFIG,
  websocketConfig,
  id = "mcx-robot",
  debug = false,
}) => {
  // Refs
  const groupRef = useRef<THREE.Group>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef(0);

  // State
  const [isConnected, setIsConnected] = useState(false);
  const [jointStates, setJointStates] = useState<Record<string, number>>({});

  // Load the GLTF model with error handling
  const gltf = useLoader(GLTFLoader, modelUrl, (loader) => {
    loader.manager.onError = (url) => {
      errorLoggingService.error(
        `Failed to load resource: ${url}`,
        new Error(`Failed to load resource: ${url}`),
        { robotId: id }
      );
    };
  });

  /**
   * Handle incoming WebSocket message
   */
  const handleWebSocketMessage = useCallback(
    (message: WebSocketMessage) => {
      if (message.jointPositions) {
        setJointStates(message.jointPositions);
        if (debug) {
          errorLoggingService.debug(`Received joint positions`, {
            robotId: id,
            jointPositions: message.jointPositions,
          });
        }
      }
    },
    [id, debug]
  );

  /**
   * Establish WebSocket connection with improved error handling
   */
  const connectWebSocket = useCallback(() => {
    try {
      const ws = new WebSocket(websocketConfig.url);

      ws.onopen = () => {
        errorLoggingService.info(`WebSocket connected`, { robotId: id });
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WebSocketMessage;
          handleWebSocketMessage(data);
        } catch (error) {
          errorLoggingService.error(
            `Error parsing WebSocket message`,
            error as Error,
            { robotId: id, rawMessage: event.data }
          );
        }
      };

      ws.onerror = (error) => {
        errorLoggingService.error(`WebSocket error`, error as Error, {
          robotId: id,
        });
      };

      ws.onclose = () => {
        errorLoggingService.info(`WebSocket disconnected`, { robotId: id });
        setIsConnected(false);

        // Attempt reconnection if configured
        const maxAttempts = websocketConfig.reconnectAttempts ?? 5;
        const interval = websocketConfig.reconnectInterval ?? 5000;

        if (reconnectAttemptsRef.current < maxAttempts) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            errorLoggingService.info(`Attempting reconnection`, {
              robotId: id,
              attempt: reconnectAttemptsRef.current,
              maxAttempts,
            });
            connectWebSocket();
          }, interval);
        } else {
          errorLoggingService.warn(`Maximum reconnection attempts reached`, {
            robotId: id,
            attempts: maxAttempts,
          });
        }
      };

      wsRef.current = ws;
    } catch (error) {
      errorLoggingService.error(
        `Error creating WebSocket connection`,
        error as Error,
        {
          robotId: id,
          websocketUrl: websocketConfig.url,
        }
      );
    }
  }, [websocketConfig, id, handleWebSocketMessage]);

  // Initialize WebSocket connection
  useEffect(() => {
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      errorLoggingService.info(`Cleaning up robot component`, { robotId: id });
    };
  }, [connectWebSocket, id]);

  return (
    <group
      ref={groupRef}
      userData={{ id, type: "MCXRobot", connected: isConnected }}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
      receiveShadow
    >
      <Suspense fallback={<LoadingFallback />}>
        {gltf ? (
          <>
            <RobotModel
              gltf={gltf.scene}
              jointConfig={jointConfig}
              jointStates={jointStates}
              debug={debug}
              id={id}
            />
            {/* 
            <ConnectionIndicator isConnected={isConnected} /> */}
          </>
        ) : (
          <ErrorFallback />
        )}
      </Suspense>
    </group>
  );
};

export default React.memo(MCXRobot);
