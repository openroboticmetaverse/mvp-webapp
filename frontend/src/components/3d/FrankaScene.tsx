import React, { useState, useEffect, useCallback, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  GizmoHelper,
  GizmoViewport,
  Grid,
  OrbitControls,
  StatsGl,
} from "@react-three/drei";

import WebGLNotSupported from "../ui/WebGLNotSupported";
import RobotObject from "./RobotObject";
import PrimitiveShape from "./PrimitiveShape";

interface FrankaSceneProps {
  websocketUrl: string;
}

const WebGLContextHandler: React.FC = () => {
  const { gl } = useThree();

  useEffect(() => {
    const handleContextLost = (event: WebGLContextEvent) => {
      event.preventDefault();
      console.log("WebGL context lost. Attempting to restore...");
    };

    const handleContextRestored = () => {
      console.log("WebGL context restored.");
    };

    gl.domElement.addEventListener(
      "webglcontextlost",
      handleContextLost,
      false
    );
    gl.domElement.addEventListener(
      "webglcontextrestored",
      handleContextRestored,
      false
    );

    return () => {
      gl.domElement.removeEventListener("webglcontextlost", handleContextLost);
      gl.domElement.removeEventListener(
        "webglcontextrestored",
        handleContextRestored
      );
    };
  }, [gl]);

  return null;
};

const FrankaScene: React.FC<FrankaSceneProps> = ({ websocketUrl }) => {
  const [jointAngles, setJointAngles] = useState<{ [key: string]: number }>({});
  const [wsStatus, setWsStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("disconnected");
  const [error, setError] = useState<string | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const checkNetworkConnectivity = useCallback(async () => {
    try {
      const response = await fetch("https://www.google.com", {
        mode: "no-cors",
      });
      return response.type === "opaque";
    } catch {
      return false;
    }
  }, []);

  const connectWebSocket = useCallback(async () => {
    if (reconnectAttempts.current >= maxReconnectAttempts) {
      const errorMsg =
        "[FrankaScene] Max reconnection attempts reached. Please try again later.";
      console.log(errorMsg);
      setError(errorMsg);
      setWsStatus("disconnected");
      return;
    }

    const isOnline = await checkNetworkConnectivity();
    if (!isOnline) {
      const errorMsg =
        "[FrankaScene] No internet connection detected. Please check your network.";
      console.log(errorMsg);
      setError(errorMsg);
      setWsStatus("disconnected");
      return;
    }

    setWsStatus("connecting");
    console.log(
      `[FrankaScene] Attempting to connect to WebSocket at ${websocketUrl}`
    );

    let socket: WebSocket;
    try {
      socket = new WebSocket(websocketUrl);
    } catch (err) {
      const errorMsg = `[FrankaScene] Error creating WebSocket: ${err}`;
      console.error(errorMsg);
      setError(errorMsg);
      setWsStatus("disconnected");
      return;
    }

    socket.onopen = () => {
      console.log("[FrankaScene] WebSocket connection established");
      setWsStatus("connected");
      setError(null);
      reconnectAttempts.current = 0;
    };

    socket.onmessage = (event) => {
      try {
        const jointData = JSON.parse(event.data);
        if (jointData.jointPositions) {
          setJointAngles(jointData.jointPositions);
        }
      } catch (error) {
        console.error("[FrankaScene] Error parsing message:", error);
      }
    };

    socket.onerror = (error) => {
      const errorMsg = `[FrankaScene] WebSocket error: ${error}`;
      console.error(errorMsg);
      setError(errorMsg);
      setWsStatus("disconnected");
    };

    socket.onclose = (event) => {
      console.log(
        `[FrankaScene] WebSocket connection closed. Code: ${event.code}, Reason: ${event.reason}`
      );
      setWsStatus("disconnected");

      if (event.code === 1006) {
        reconnectAttempts.current++;
        const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30000);
        console.log(
          `[FrankaScene] Attempting to reconnect in ${delay / 1000} seconds...`
        );
        setTimeout(connectWebSocket, delay);
      }
    };

    return () => {
      console.log("[FrankaScene] Closing WebSocket connection");
      socket.close();
    };
  }, [websocketUrl, checkNetworkConnectivity]);

  useEffect(() => {
    const cleanup = connectWebSocket();
    return () => {
      if (cleanup && typeof cleanup === "function") {
        cleanup();
      }
    };
  }, [connectWebSocket]);

  const handleManualReconnect = () => {
    reconnectAttempts.current = 0;
    setError(null);
    connectWebSocket();
  };

  return (
    <>
      <div className="absolute top-0 right-0 z-10 p-2 bg-black bg-opacity-50 text-white">
        <div>WebSocket Status: {wsStatus}</div>
        {error && <div className="text-red-500">{error}</div>}
        {wsStatus === "disconnected" && (
          <button
            onClick={handleManualReconnect}
            className="mt-2 px-2 py-1 bg-blue-500 rounded"
          >
            Reconnect
          </button>
        )}
      </div>
      <Canvas
        camera={{ position: [5, 5, 5], fov: 60, near: 0.1, far: 200 }}
        style={{ background: "#242625" }}
        className="m-0 w-full h-full absolute"
        dpr={[0.8, 2]}
        fallback={<WebGLNotSupported />}
      >
        <WebGLContextHandler />
        <OrbitControls makeDefault />
        <ambientLight intensity={0.8} />
        <directionalLight
          castShadow
          position={[5, 10, 5]}
          intensity={2}
          shadow-mapSize={[512, 512]}
        />
        <RobotObject
          name="FrankaRobot"
          type="panda"
          sceneId="franka"
          position={[0, 0, 0]}
          jointAngles={jointAngles}
        />
        <PrimitiveShape
          shape="cube"
          position={[-2, 0, 0]}
          sceneId="1"
          name="goal"
          color="pink"
        />
        <Grid
          args={[10, 100]}
          infiniteGrid
          fadeDistance={120}
          sectionColor={0xdee2e6}
          cellColor={0xdee2e6}
          sectionSize={10}
          cellSize={1}
          fadeStrength={2}
        />
        <StatsGl />
        <GizmoHelper alignment="bottom-right" margin={[70, 70]}>
          <GizmoViewport
            axisColors={["#9d4b4b", "#2f7f4f", "#3b5b9d"]}
            labelColor="white"
          />
        </GizmoHelper>
      </Canvas>
    </>
  );
};

export default FrankaScene;
