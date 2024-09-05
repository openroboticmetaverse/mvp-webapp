import { Canvas } from "@react-three/fiber";
import {
  GizmoHelper,
  GizmoViewport,
  Grid,
  OrbitControls,
  StatsGl,
} from "@react-three/drei";

import WebGLNotSupported from "../ui/WebGLNotSupported";
import PrimitiveShape from "./PrimitiveShape";
import PropObject from "./PropObject";
import RobotObject from "./RobotObject";

const Scene: React.FC = () => {
  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[0, 10, 10]} />
      <PrimitiveShape
        shape="sphere"
        position={[-2, 0, 0]}
        sceneId="1"
        name="Sphere1"
      />
      <PrimitiveShape
        shape="cube"
        position={[0, 0, 0]}
        sceneId="1"
        name="Cube1"
      />
      <PrimitiveShape
        shape="cylinder"
        position={[2, 0, 0]}
        sceneId="1"
        name="Cylinder1"
      />
      <PropObject name="apple" type="apple" sceneId="1" position={[-4, 0, 0]} />
      <RobotObject
        type="panda"
        sceneId="1"
        position={[-6, 0, 0]}
        name="Robot1"
      />
      <RobotObject
        type="sawyer"
        sceneId="1"
        position={[-8, 0, 0]}
        name="Robot2"
      />
    </>
  );
};

export const SimpleScene = () => {
  return (
    <Canvas
      camera={{ position: [20, 7, 12], fov: 60, near: 0.1, far: 200 }}
      style={{ background: "#242625" }}
      className="m-0 w-full h-full absolute"
      dpr={[0.8, 2]} // Change Device Pixel Ratio for performance: lower is better
      fallback={
        <>
          <WebGLNotSupported />
        </>
      }
    >
      <OrbitControls makeDefault />
      <Scene />

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