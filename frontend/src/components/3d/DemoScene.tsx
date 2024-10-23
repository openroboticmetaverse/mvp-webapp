import React, { Suspense } from "react";
import MCXRobot from "./MCXRobot";
import SceneEnvironment from "./SceneEnvironment";
import { Canvas } from "@react-three/fiber";
import WebGLNotSupported from "../ui/WebGLNotSupported";
import { errorLoggingService } from "@/services/error-logging-service";
import RobotTarget from "./RobotTarget";
import PropTable from "./GLTFProp";
import GLTFProp from "./GLTFProp";
import URDFRobot from "./URDFRobot";
import WindTurbine from "./WindTurbine";
import { IndustrialScene } from "./IndustrialScene";

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
    url: "ws://localhost:8765",
    //url: "ws://localhost:8082/",
    reconnectAttempts: 5,
    reconnectInterval: 5000,
    messageType: "joint_states", // Optional: specify if server sends typed messages
  };
  const websocketConfig_2 = {
    //url: "ws://134.61.134.249:8081/",
    url: "ws://localhost:8765",
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

  const rosConfig = {
    url: "localhost",
    port: "9090",
    topicName: "/joint_states",
    messageType: "sensor_msgs/JointState",
  };

  return (
    <>
      {/* MCXRobot with required props */}
      <Canvas
        camera={{ position: [-10, 7, 1], fov: 50, near: 0.1, far: 200 }}
        style={{ background: "#242625" }}
        className="m-0 w-full h-full absolute"
        dpr={[0.8, 2]}
        fallback={<WebGLNotSupported />}
        onCreated={() =>
          errorLoggingService.info("Canvas created successfully")
        }
      >
        <SceneEnvironment />

        <WindTurbine position={[-6, 0, -16]} />
        <WindTurbine position={[0, 0, -20]} />
        <WindTurbine position={[6, 0, -16]} />

        <MCXRobot
          modelUrl="/models/MCX-Anthropomorphic-Robot-R01.glb"
          position={[-2, 0, -7]}
          scale={[2, 2, 2]}
          rotation={[-1.5707963267948966, 0, -1.57]}
          jointConfig={jointConfig_1}
          websocketConfig={websocketConfig_1}
          id="motorcortex-robot"
        />
        <MCXRobot
          modelUrl="/models/MCX-Anthropomorphic2-Robot-R00.glb"
          position={[-2, 0, -4]}
          rotation={[-1.5707963267948966, 0, -1.57]}
          scale={[2, 2, 2]}
          jointConfig={jointConfig_2}
          websocketConfig={websocketConfig_2}
          id="mujoco-robot"
        />
        <URDFRobot
          type="panda"
          position={[-6, 0, -4]}
          rotation={[0, 0, 0]}
          scale={[1, 1, 1]}
          id="panda-1"
          initialJointStates={{
            panda_joint6: -1.04,
            panda_joint2: 0.04,
            panda_joint4: 1.04,
            panda_joint3: 3.04,
            panda_joint5: -1.04,
          }}
          rosConfig={rosConfig}
        />
        <URDFRobot
          type="sawyer"
          position={[-5, 0, -7]}
          rotation={[0, -1.57, 0]}
          scale={[1, 1, 1]}
          id="sawyer-1"
          initialJointStates={{
            panda_joint6: -1.04,
            panda_joint2: 0.04,
            panda_joint4: 1.04,
            panda_joint3: 3.04,
            panda_joint5: -1.04,
          }}
          rosConfig={rosConfig}
        />
        {/* {[...Array(100)].map((_, index) => {
          // Calculate grid position (10x10 grid)
          const row = Math.floor(index / 10);
          const col = index % 10;

          return (
            <MCXRobot
              key={`robot-${index}`}
              modelUrl="/models/MCX-Anthropomorphic2-Robot-R00.glb"
              position={[row * 4, 0, col * 4]} // 4 units spacing between robots
              scale={[2, 2, 2]}
              jointConfig={jointConfig_2}
              websocketConfig={websocketConfig_1}
              id={`robot-${index}`}
              debug={false} // Set to false for better performance
            />
          );
        })} */}

        <GLTFProp
          modelUrl="/models/apple-low-poly.gltf"
          position={[-5, 0, -4]}
          scale={[1.1, 1.1, 1.1]}
        />
        <GLTFProp
          modelUrl="/models/apple-low-poly.gltf"
          position={[-4, 0, -4]}
          scale={[1.2, 1.2, 1.2]}
        />
        <GLTFProp
          modelUrl="/models/apple-low-poly.gltf"
          position={[-4.5, 0, -5]}
        />
        <GLTFProp
          modelUrl="/models/apple-low-poly.gltf"
          position={[-6, 0, -3]}
        />

        <GLTFProp
          modelUrl="/models/cybertruck.gltf"
          position={[6, 0, -7]}
          rotation={[0, -0.4, 0]}
        />
        <GLTFProp
          modelUrl="/models/industrial-scene.glb"
          position={[2, 0, -28]}
          rotation={[0, 0.7, 0]}
        />
      </Canvas>
    </>
  );
};

export default DemoScene;
