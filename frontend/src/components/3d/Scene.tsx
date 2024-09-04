import React from "react";
import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls, StatsGl } from "@react-three/drei";
import { GeometricObjectComponent } from "./GeometricObject";

const Scene: React.FC = () => {
  return (
    <Canvas
      camera={{ position: [20, 7, 12], fov: 60, near: 0.1, far: 100 }}
      style={{ background: "#242625" }}
      className="m-0 w-full h-full absolute"
      shadows
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <GeometricObjectComponent
        id={1}
        name="Cube"
        sceneId="main"
        primitiveType="cube"
        parameters={{ cube: { width: 2, height: 2, depth: 2 } }}
        position={[0, 0, 0]}
        color="#ff0000"
      />
      <GeometricObjectComponent
        id={2}
        name="Sphere"
        sceneId="main"
        primitiveType="sphere"
        parameters={{
          sphere: { radius: 1, widthSegments: 32, heightSegments: 32 },
        }}
        position={[3, 0, 0]}
        color="#00ff00"
      />
      <OrbitControls />
      <Grid
        args={[10, 100]}
        infiniteGrid
        fadeDistance={100}
        sectionColor={0xdee2e6}
        cellColor={0xdee2e6}
        sectionSize={10}
        cellSize={1}
        fadeStrength={2}
      />
      <StatsGl />
    </Canvas>
  );
};

export default Scene;
