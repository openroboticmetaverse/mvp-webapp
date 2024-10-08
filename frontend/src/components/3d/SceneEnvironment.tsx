import React from "react";
import {
  GizmoHelper,
  GizmoViewport,
  Grid,
  OrbitControls,
  StatsGl,
} from "@react-three/drei";

const SceneEnvironment: React.FC = () => {
  return (
    <>
      <OrbitControls makeDefault />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
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
    </>
  );
};

export default SceneEnvironment;
