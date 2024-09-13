import React from "react";
import { Canvas } from "@react-three/fiber";
import {
  GizmoHelper,
  GizmoViewport,
  Grid,
  OrbitControls,
  StatsGl,
} from "@react-three/drei";

import WebGLNotSupported from "../ui/WebGLNotSupported";
import RobotObject from "./RobotObject";

interface FrankaSceneProps {
  websocketUrl: string;
}

const FrankaScene: React.FC<FrankaSceneProps> = ({ websocketUrl }) => {
  return (
    <Canvas
      camera={{ position: [5, 5, 5], fov: 60, near: 0.1, far: 200 }}
      style={{ background: "#242625" }}
      className="m-0 w-full h-full absolute"
      dpr={[0.8, 2]}
      fallback={<WebGLNotSupported />}
    >
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
        websocketUrl={websocketUrl}
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
  );
};

export default FrankaScene;
