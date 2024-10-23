import React from "react";
import MCXRobot from "./MCXRobot";
import SceneEnvironment from "./SceneEnvironment";
import { Canvas } from "@react-three/fiber";
import WebGLNotSupported from "../ui/WebGLNotSupported";
import { errorLoggingService } from "@/services/error-logging-service";
import RobotTarget from "./RobotTarget";

const DemoScene: React.FC = () => {
  // Optional custom joint configuration
  const jointConfig_1 = [
    { name: "Base", axis: "" as const },
    { name: "Link1", axis: "rz" as const },
    { name: "Link2", axis: "ry" as const },
    { name: "Link3", axis: "ry" as const },
    { name: "Link4", axis: "rz" as const },
    { name: "Link5", axis: "ry" as const },
    { name: "Link6", axis: "rz" as const },
  ];

  const jointConfig_2 = [
    { name: "Base", axis: "" as const },
    { name: "Link1", axis: "rz" as const },
    { name: "Link2", axis: "ry" as const },
    { name: "Link3", axis: "ry" as const },
    { name: "Link4", axis: "ry" as const },
    { name: "Link5", axis: "rz" as const },
    { name: "Link6", axis: "ry" as const },
  ];

  const websocketConfig_1 = {
    url: "ws://134.61.134.249:8082/",
    reconnectAttempts: 5,
    reconnectInterval: 5000,
    messageType: "joint_states", // Optional: specify if server sends typed messages
  };
  const websocketConfig_2 = {
    url: "ws://134.61.134.249:8081/",
    reconnectAttempts: 5,
    reconnectInterval: 5000,
    messageType: "joint_states",
  };
  /*   const websocketConfig_Local = {
    url: "ws://localhost:8085",
    reconnectAttempts: 5,
    reconnectInterval: 5000,
    messageType: "joint_states",
  };
 */
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
          modelUrl="/models/MCX-Anthropomorphic-Robot-R01.glb"
          position={[0, 0, 0]}
          scale={[2, 2, 2]}
          jointConfig={jointConfig_1}
          websocketConfig={websocketConfig_1}
          id="motorcortex-robot"
        />
        <MCXRobot
          modelUrl="/models/MCX-Anthropomorphic2-Robot-R00.glb"
          position={[-2, 0, 0]}
          scale={[2, 2, 2]}
          jointConfig={jointConfig_2}
          websocketConfig={websocketConfig_2}
          id="mujoco-robot"
        />
        {/*         <MCXRobot
          modelUrl="/models/MCX-Anthropomorphic2-Robot-R00.glb"
          position={[2, 0, 0]}
          jointConfig={jointConfig}
          websocketConfig={websocketConfig_Local}
          id="local-robot"
          debug={true}
        /> */}
      </Canvas>
    </>
  );
};

export default DemoScene;
