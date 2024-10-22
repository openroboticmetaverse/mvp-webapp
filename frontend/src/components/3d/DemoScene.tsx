import React from "react";
import MCXRobot from "./MCXRobot";
import SceneEnvironment from "./SceneEnvironment";
import { Canvas } from "@react-three/fiber";
import WebGLNotSupported from "../ui/WebGLNotSupported";
import { errorLoggingService } from "@/services/error-logging-service";
import RobotTarget from "./RobotTarget";

const DemoScene: React.FC = () => {
  // Optional custom joint configuration
  const jointConfig = [
    { name: "Base", axis: "rx" as const },
    { name: "Link1", axis: "rz" as const },
    { name: "Link2", axis: "ry" as const },
    { name: "Link3", axis: "ry" as const },
    { name: "Link4", axis: "ry" as const },
    { name: "Link5", axis: "rz" as const },
    { name: "Link6", axis: "ry" as const },
  ];

  const websocketConfig = {
    url: "ws://134.61.134.249:8081/",
    reconnectAttempts: 5,
    reconnectInterval: 5000,
    messageType: "joint_states", // Optional: specify if server sends typed messages
  };

  return (
    <>
      {/* MCXRobot with required props */}
      <Canvas
        camera={{ position: [20, 7, 12], fov: 60, near: 0.1, far: 200 }}
        style={{ background: "#242625" }}
        className="m-0 w-full h-full absolute"
        dpr={[0.8, 2]}
        fallback={<WebGLNotSupported />}
        onCreated={() =>
          errorLoggingService.info("Canvas created successfully")
        }
      >
        <SceneEnvironment />
        <MCXRobot
          modelUrl="/models/MCX-Anthropomorphic2-Robot-R00.glb"
          position={[0, 0, 0]}
          jointConfig={jointConfig}
          websocketConfig={websocketConfig}
          id="demo-robot"
        />
        <RobotTarget websocketUrl={"ws://134.61.134.249:8082/"} />
      </Canvas>
    </>
  );
};

export default DemoScene;
