import React, {
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useState,
} from "react";
import { ThreeEvent, useLoader, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

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
  const modelRef = useRef<THREE.Group | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef(0);

  // State
  const [isConnected, setIsConnected] = useState(false);
  const [jointStates, setJointStates] = useState<Record<string, number>>({});

  // Load the GLTF model
  const gltf = useLoader(GLTFLoader, modelUrl);

  /**
   * Handle incoming WebSocket message
   */
  const handleWebSocketMessage = useCallback(
    (message: WebSocketMessage) => {
      if (message.jointPositions) {
        setJointStates(message.jointPositions);
        if (debug) {
          console.debug(
            `MCXRobot ${id}: Received joint positions:`,
            message.jointPositions
          );
        }
      }
    },
    [id, debug]
  );

  /**
   * Establish WebSocket connection
   */
  const connectWebSocket = useCallback(() => {
    try {
      const ws = new WebSocket(websocketConfig.url);

      ws.onopen = () => {
        console.log(`MCXRobot ${id}: WebSocket connected`);
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WebSocketMessage;
          handleWebSocketMessage(data);
        } catch (error) {
          console.error(
            `MCXRobot ${id}: Error parsing WebSocket message:`,
            error
          );
        }
      };

      ws.onerror = (error) => {
        console.error(`MCXRobot ${id}: WebSocket error:`, error);
      };

      ws.onclose = () => {
        console.log(`MCXRobot ${id}: WebSocket disconnected`);
        setIsConnected(false);

        // Attempt reconnection if configured
        const maxAttempts = websocketConfig.reconnectAttempts ?? 5;
        const interval = websocketConfig.reconnectInterval ?? 5000;

        if (reconnectAttemptsRef.current < maxAttempts) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            console.log(
              `MCXRobot ${id}: Attempting reconnection ${reconnectAttemptsRef.current}/${maxAttempts}`
            );
            connectWebSocket();
          }, interval);
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error(
        `MCXRobot ${id}: Error creating WebSocket connection:`,
        error
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
    };
  }, [connectWebSocket]);

  // Store the model reference once loaded
  useEffect(() => {
    if (gltf.scene) {
      modelRef.current = gltf.scene.clone();
      if (debug) {
        console.debug(
          `MCXRobot ${id}: Model loaded, joint names:`,
          Array.from(gltf.scene.children).map((child) => child.name)
        );
      }
    }
  }, [gltf, id, debug]);

  /**
   * Apply joint angles to the model
   */
  const applyJointAngles = useCallback(
    (
      model: THREE.Object3D,
      config: JointConfig[],
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

              if (debug) {
                console.debug(
                  `MCXRobot ${id}: Applied rotation to joint ${child.name}: ${angle} on axis ${jointConfigItem.axis}`
                );
              }
            }
          }
        }
      });
    },
    [id, debug]
  );

  // Update joint angles every frame when connected
  useFrame(() => {
    if (modelRef.current && isConnected) {
      applyJointAngles(modelRef.current, jointConfig, jointStates);
    }
  });

  // Connection status indicator
  const ConnectionStatus = useMemo(() => {
    return (
      <mesh position={[0, 2, 0]} scale={0.2}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color={isConnected ? "#00ff00" : "#ff0000"} />
      </mesh>
    );
  }, [isConnected]);

  return (
    <group
      ref={groupRef}
      userData={{ id, type: "MCXRobot", connected: isConnected }}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      {gltf ? (
        <>
          <primitive object={modelRef.current || gltf.scene} />
          {ConnectionStatus}
        </>
      ) : (
        <mesh>
          <sphereGeometry args={[1, 32]} />
          <meshStandardMaterial color="red" />
        </mesh>
      )}
    </group>
  );
};

export default MCXRobot;
