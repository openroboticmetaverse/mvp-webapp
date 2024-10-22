import React, { useRef, useEffect, useCallback } from "react";
import { TransformControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Props for the RobotTarget component
 */
interface RobotTargetProps {
  // WebSocket URL to connect to
  websocketUrl: string;
  // Initial position of the target [x, y, z]
  position?: [number, number, number];
  // Color of the target cube
  color?: string;
}

/**
 * A simple target cube that can be moved in 3D space and syncs its position
 * with a WebSocket server.
 */
const RobotTarget: React.FC<RobotTargetProps> = ({
  websocketUrl,
  position = [0, 0, 0],
  color = "#FFD700",
}) => {
  // Reference to the target mesh
  const targetRef = useRef<THREE.Mesh>(null);
  // Reference to WebSocket connection
  const wsRef = useRef<WebSocket | null>(null);
  // Get three.js camera
  const { camera } = useThree();

  /**
   * Send the target's position to the WebSocket server
   */
  const sendPosition = useCallback(() => {
    if (!targetRef.current || !wsRef.current) return;

    const position = targetRef.current.position.toArray();
    wsRef.current.send(JSON.stringify({ position }));
  }, []);

  /**
   * Handle changes from the transform controls
   */
  const handleTransformChange = useCallback(() => {
    if (!targetRef.current) return;
    sendPosition();
  }, [sendPosition]);

  /**
   * Initialize WebSocket connection
   */
  useEffect(() => {
    // Create WebSocket connection
    const ws = new WebSocket(websocketUrl);

    // Set up event handlers
    ws.onopen = () => console.log("Connected to server");
    ws.onclose = () => console.log("Disconnected from server");
    ws.onerror = (error) => console.error("WebSocket error:", error);

    // Store WebSocket reference
    wsRef.current = ws;

    // Cleanup on unmount
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [websocketUrl]);

  return (
    <>
      {/* Target Cube */}
      <mesh ref={targetRef} position={position}>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial color={color} transparent opacity={0.8} />
      </mesh>

      {/* Transform Controls */}
      <TransformControls
        object={targetRef.current}
        mode="translate"
        size={0.75}
        onObjectChange={handleTransformChange}
        camera={camera}
      />
    </>
  );
};

export default RobotTarget;
